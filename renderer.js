console.log("Renderer script loaded");

document
  .getElementById("as-many-as-possible-checkbox")
  .addEventListener("change", (event) => {
    const participantsCountInput =
      document.getElementById("participants-count");
    participantsCountInput.disabled = event.target.checked;
  });

document
  .getElementById("select-warriors")
  .addEventListener("click", async () => {
    console.log("Button clicked");
    const progressBar = document.getElementById("progress-bar");
    const progressContainer = document.querySelector(".progress-container");
    const errorMessage = document.getElementById("error-message");
    const warriorsList = document.getElementById("warriors-list");

    // Clear previous error messages and warriors list
    errorMessage.style.display = "none";
    errorMessage.textContent = "";
    warriorsList.innerHTML = "";

    const clanTag = document.getElementById("clan-tag").value.trim();
    const minTownHallLevel = parseInt(
      document.getElementById("town-hall-level").value,
      10
    );
    const asManyAsPossibleCheckbox = document.getElementById(
      "as-many-as-possible-checkbox"
    ).checked;
    let participantsCount = null;

    if (!asManyAsPossibleCheckbox) {
      participantsCount = parseInt(
        document.getElementById("participants-count").value,
        10
      );
      if (isNaN(participantsCount) || participantsCount % 5 !== 0) {
        throw new Error("Number of participants must be a multiple of 5!");
      }
    }

    try {
      // Show progress bar
      progressContainer.style.display = "block";
      progressBar.style.width = "0%";
      progressBar.textContent = "0%";

      const response = await window.api.fetchClanData(clanTag);
      if (response.ok) {
        console.log("API clan response received");
        console.log(response);
        // saveClanTag();
      }

      const selectedMembers = await selectRandomWarParticipants(
        response,
        minTownHallLevel,
        participantsCount,
        progressBar
      );
      console.log("These are the selected members:");
      console.log(selectedMembers);

      if (selectedMembers.length < 5) {
        throw new Error("Not enough members meeting the criteria!");
      }

      displayWarriors(selectedMembers);
    } catch (error) {
      console.error("Error selecting the warriors: ", error);
      errorMessage.style.display = "block";
      errorMessage.textContent = error;

      // Hide progress bar in case of error
      progressContainer.style.display = "none";
    }
  });

async function selectRandomWarParticipants(
  clanData,
  minTownHallLevel,
  participantsCount,
  progressBar
) {
  const inMembers = [];
  const totalMembers = clanData.memberList.length;

  for (let i = 0; i < totalMembers; i++) {
    try {
      const response = await window.api.fetchMemberData(
        clanData.memberList[i].tag
      );

      // Update progress bar
      const progress = ((i + 1) / totalMembers) * 100;
      progressBar.style.width = `${progress}%`;
      progressBar.textContent = `${Math.floor(progress)}%`;

      if (
        response.townHallLevel >= minTownHallLevel &&
        response.warPreference === "in"
      ) {
        inMembers.push(response.name);
      }
    } catch (error) {
      console.error(
        `Error fetching member data for ${clanData.memberList[i].tag}: `,
        error
      );
    }
  }

  const maxParticipants = Math.floor(inMembers.length / 5) * 5;
  let numberOfParticipants = participantsCount || maxParticipants;

  if (numberOfParticipants > maxParticipants) {
    numberOfParticipants = maxParticipants;
  }
  const shuffledMembers = inMembers.sort(() => 0.5 - Math.random());
  const selectedMembers = shuffledMembers.slice(0, numberOfParticipants);

  return selectedMembers;
}

function displayWarriors(warriors) {
  const warriorsList = document.getElementById("warriors-list");
  warriorsList.innerHTML = "";

  warriors.forEach((warrior) => {
    const warriorDiv = document.createElement("div");
    warriorDiv.classList.add("warrior-name");
    warriorDiv.textContent = warrior;
    warriorsList.appendChild(warriorDiv);
  });

  // Hide progress bar
  const progressContainer = document.querySelector(".progress-container");
  progressContainer.style.display = "none";
}

// Handle instructions button click
document.getElementById("instructions-button").addEventListener("click", () => {
  const instructionsContainer = document.getElementById(
    "instructions-container"
  );
  instructionsContainer.style.display =
    instructionsContainer.style.display === "block" ? "none" : "block";
});

// Populate town hall level options
const townHallSelect = document.getElementById("town-hall-level");
for (let i = 3; i <= 16; i++) {
  const option = document.createElement("option");
  option.value = i;
  option.textContent = `TH ${i}`;
  townHallSelect.appendChild(option);
}

// Load saved clan tag from localStorage
// async function saveClanTag() {
//   const savedClanTag = await localStorage.getItem("clanTag");
//   if (savedClanTag) {
//     document.getElementById("clan-tag").value = savedClanTag;
//   }
// }
