declare module 'clash-of-clans-api' {
  interface ClashClient {
    clanByTag(tag: string): Promise<ClanData>;
    playerByTag(tag: string): Promise<MemberData>;
  }
  function clashApi(options: { token: string }): ClashClient;
  export = clashApi;
}

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
