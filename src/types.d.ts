interface ClanMember {
  tag: string;
}

interface ClanData {
  memberList: ClanMember[];
}

interface MemberData {
  name: string;
  townHallLevel: number;
  warPreference: 'in' | 'out';
}

interface Window {
  api: {
    fetchClanData(clanTag: string): Promise<ClanData>;
    fetchMemberData(memberTag: string): Promise<MemberData>;
  };
}
