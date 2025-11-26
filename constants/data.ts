export interface SportEvent {
    idEvent: string;
    strEvent: string;
    strThumb: string;
    strStatus: string;
    dateEvent: string;
    strLeague: string;
    strDescriptionEN?: string;
    strHomeTeam?: string;
    strAwayTeam?: string;
    intHomeScore?: string;
    intAwayScore?: string;
}

export const dummyEvents: SportEvent[] = [
    {
        idEvent: '1',
        strEvent: 'Arsenal vs Chelsea',
        strThumb: 'https://www.thesportsdb.com/images/media/event/thumb/yqyupv1544549071.jpg',
        strStatus: 'Upcoming',
        dateEvent: '2025-12-01',
        strLeague: 'English Premier League',
        strDescriptionEN: 'A classic London derby between Arsenal and Chelsea at the Emirates Stadium.',
        strHomeTeam: 'Arsenal',
        strAwayTeam: 'Chelsea',
        intHomeScore: '0',
        intAwayScore: '0',
    },
    {
        idEvent: '2',
        strEvent: 'Liverpool vs Man City',
        strThumb: 'https://www.thesportsdb.com/images/media/event/thumb/vsysxv1544549117.jpg',
        strStatus: 'Upcoming',
        dateEvent: '2025-12-02',
        strLeague: 'English Premier League',
        strDescriptionEN: 'Title contenders Liverpool and Manchester City clash at Anfield.',
        strHomeTeam: 'Liverpool',
        strAwayTeam: 'Man City',
        intHomeScore: '0',
        intAwayScore: '0',
    },
    {
        idEvent: '3',
        strEvent: 'Man Utd vs Tottenham',
        strThumb: 'https://www.thesportsdb.com/images/media/event/thumb/uxtqrx1544549156.jpg',
        strStatus: 'Upcoming',
        dateEvent: '2025-12-03',
        strLeague: 'English Premier League',
        strDescriptionEN: 'Manchester United hosts Tottenham Hotspur at Old Trafford.',
        strHomeTeam: 'Man Utd',
        strAwayTeam: 'Tottenham',
        intHomeScore: '0',
        intAwayScore: '0',
    },
];
