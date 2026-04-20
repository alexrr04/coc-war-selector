console.log('Renderer script loaded');

function getEl<T extends HTMLElement>(id: string): T {
  return document.getElementById(id) as T;
}

function showError(message: string): void {
  const errorMessage = getEl('error-message');
  const progressContainer = document.querySelector(
    '.progress-container'
  ) as HTMLElement;
  errorMessage.style.display = 'block';
  errorMessage.textContent = message;
  progressContainer.style.display = 'none';
}

function friendlyError(error: unknown): string {
  if (error instanceof Error) return error.message;
  const msg = String(error);
  if (msg.includes('Clan not found')) return 'Clan not found. Check the tag and try again.';
  if (msg.includes('not initialised')) return 'API not configured — please create a .env file with your COC_API_TOKEN and run node build.js first.';
  return msg;
}

getEl('as-many-as-possible-checkbox').addEventListener('change', (event) => {
  const participantsCountInput = getEl<HTMLInputElement>('participants-count');
  participantsCountInput.disabled = (event.target as HTMLInputElement).checked;
});

getEl('select-warriors').addEventListener('click', async () => {
  const progressBar = getEl('progress-bar');
  const progressContainer = document.querySelector(
    '.progress-container'
  ) as HTMLElement;
  const errorMessage = getEl('error-message');
  const warriorsList = getEl('warriors-list');

  errorMessage.style.display = 'none';
  errorMessage.textContent = '';
  warriorsList.innerHTML = '';

  const clanTag = getEl<HTMLInputElement>('clan-tag').value.trim();
  if (!clanTag) {
    showError('Please enter a clan tag.');
    return;
  }

  const minTownHallLevel = parseInt(
    (getEl<HTMLSelectElement>('town-hall-level')).value,
    10
  );
  const asManyAsPossible = (
    getEl<HTMLInputElement>('as-many-as-possible-checkbox')
  ).checked;
  let participantsCount: number | null = null;

  if (!asManyAsPossible) {
    participantsCount = parseInt(
      getEl<HTMLInputElement>('participants-count').value,
      10
    );
    if (isNaN(participantsCount) || participantsCount % 5 !== 0) {
      showError('Number of participants must be a multiple of 5.');
      return;
    }
  }

  try {
    progressContainer.style.display = 'block';
    progressBar.style.width = '0%';
    progressBar.textContent = '0%';

    const clanData = await window.api.fetchClanData(clanTag);
    const selectedMembers = await selectRandomWarParticipants(
      clanData,
      minTownHallLevel,
      participantsCount,
      progressBar
    );

    if (selectedMembers.length < 5) {
      throw new Error(
        'Not enough members meet the criteria (Town Hall level + war preference set to IN).'
      );
    }

    displayWarriors(selectedMembers);
  } catch (error) {
    console.error('Error selecting warriors:', error);
    showError(friendlyError(error));
  }
});

async function selectRandomWarParticipants(
  clanData: ClanData,
  minTownHallLevel: number,
  participantsCount: number | null,
  progressBar: HTMLElement
): Promise<string[]> {
  const eligible: string[] = [];
  const totalMembers = clanData.memberList.length;

  for (let i = 0; i < totalMembers; i++) {
    try {
      const member = await window.api!.fetchMemberData(
        clanData.memberList[i].tag
      );

      const progress = ((i + 1) / totalMembers) * 100;
      progressBar.style.width = `${progress}%`;
      progressBar.textContent = `${Math.floor(progress)}%`;

      if (
        member.townHallLevel >= minTownHallLevel &&
        member.warPreference === 'in'
      ) {
        eligible.push(member.name);
      }
    } catch (error) {
      console.error(
        `Error fetching member ${clanData.memberList[i].tag}:`,
        error
      );
    }
  }

  const maxParticipants = Math.floor(eligible.length / 5) * 5;
  const count = Math.min(participantsCount ?? maxParticipants, maxParticipants);
  const shuffled = eligible.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function displayWarriors(warriors: string[]): void {
  const warriorsList = getEl('warriors-list');
  warriorsList.innerHTML = '';

  warriors.forEach((warrior) => {
    const div = document.createElement('div');
    div.classList.add('warrior-name');
    div.textContent = warrior;
    warriorsList.appendChild(div);
  });

  (document.querySelector('.progress-container') as HTMLElement).style.display =
    'none';
}

getEl('instructions-button').addEventListener('click', () => {
  const container = getEl('instructions-container');
  container.style.display =
    container.style.display === 'block' ? 'none' : 'block';
});

const townHallSelect = getEl<HTMLSelectElement>('town-hall-level');
for (let i = 3; i <= 16; i++) {
  const option = document.createElement('option');
  option.value = String(i);
  option.textContent = `TH ${i}`;
  townHallSelect.appendChild(option);
}
