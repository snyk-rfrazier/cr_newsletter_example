import axios from 'axios';

const snykApiUrl = 'https://api.snyk.io/rest/';
const snykAuthToken = 'TOKEN'; // Replace with your Snyk API token
const groupId = "GROUP_ID"; // Replace with Snyk Group ID
const version =  "2024-06-21"; // Can update with later Snyk API versions

interface SnykOrg {
  id: string;
  name: string;
}

interface SnykIssue {
  orgId: string;
  orgName: string;
  severity: string;
}

interface OrgSeverityCounts {
  [orgId: string]: { 
    orgName: string; 
    severity: {
      critical: number,
      high: number,
      medium: number,
      low: number,
    }
  }
}


const getOrgData = async (url: string): Promise<SnykOrg[]> => {
  const snykUrl: URL = new URL('orgs', snykApiUrl)
  try {
    const response = await axios.get(snykUrl.toString(), {
      headers: {
        Authorization: `Token ${snykAuthToken}`,
      },
      params: {
        version,
        limit: 100,
        group_id: groupId
      }
    });
    return response.data.data.map((org: any) => {
      return {
        "id": org.id,
        "name": org.attributes.name,
      }
    })
  } catch (error) {
    throw error;
  }
};

const getIssuesByOrg = async (org: SnykOrg, cursor?: string, allIssues: SnykIssue[] = []): Promise<SnykIssue[]> => {
  const snykUrl: URL = new URL(`orgs/${org.id}/issues`, snykApiUrl)
  const params: any = {
    version,
    limit: 100,
    status: "open",
  }
  if (cursor) {
    params['starting_after'] = cursor;
  }
  try {
    const response = await axios.get(snykUrl.toString(), {
      headers: {
        Authorization: `Token ${snykAuthToken}`,
      },
      params,
    })
    let issues: SnykIssue[] = [];
    issues = response.data.data.map((issue: any) => ({
      orgId: org.id,
      orgName: org.name,
      severity: issue.attributes?.effective_severity_level
      // Can grab a bunch more data here as it's needed
    }));
    const links = response.data.links || {}
    allIssues.push(...issues);
    if (links.next) {
      const url = new URL(links.next, snykApiUrl)
      const nextCursor = url.searchParams.get("starting_after")
      return await getIssuesByOrg(org, nextCursor, allIssues)
    }
    return allIssues;
  } catch (error) {
   throw error 
  }
}

const getIssuesByOrgs = async (org: SnykOrg): Promise<SnykIssue[]> => {
  return await getIssuesByOrg(org)
}

const processIssuesBySeverity = (issues: SnykIssue[]): OrgSeverityCounts => {
  const orgsWithIssueCounts = issues.reduce((orgs, issue) => {
    if (!orgs[issue.orgId]) {
      orgs[issue.orgId] = {
        orgName: issue.orgName,
        severity: { critical: 0, high: 0, medium: 0, low: 0 }
      }
    }
    orgs[issue.orgId].severity[issue.severity]++;
    return orgs;
  }, {})
  return orgsWithIssueCounts;
}

const main = async () => {
  try {
    const orgs: SnykOrg[] = await getOrgData(snykApiUrl);
    const allIssues = (await Promise.all(orgs.map(getIssuesByOrgs)));
    const flattened = allIssues.flat();
    const orgCounts = processIssuesBySeverity(flattened);

    // do something with orgCounts (eg. send to a CSV)
    // add to some sort of charting tool, etc. 


  } catch (error) {
    console.error('Error fetching data from Snyk API:', error);
  }
};

main();

