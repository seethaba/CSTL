export interface Match {
	$key?: string;
	team1Key?: string;
	team2Key?: string;
	team1Name?: string;
	team2Name?: string;
	referee1Name?: string;
	referee2Name?: string;
	matchType?: string;
	reguNumber?: number;
	pool?: string;
	dateTime?: string;
	location?: string;
	toss?: string;
	chosen?: string;
	status?: string;
	matchCreated?: boolean;
	profileKey: string;
	currentSet: string;
	orderKey?: string;
}