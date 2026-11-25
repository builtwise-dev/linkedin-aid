import { gql, type DocumentNode } from '@apollo/client';
import { useMutation } from '@vue/apollo-composable';
import saveCrmCompanySource from '@/graphql/operations/save-crm-company.graphql?raw';
import saveCrmPersonSource from '@/graphql/operations/save-crm-person.graphql?raw';
import deleteCrmCompanySource from '@/graphql/operations/delete-crm-company.graphql?raw';
import deleteCrmPersonSource from '@/graphql/operations/delete-crm-person.graphql?raw';
import updatePersonStatusSource from '@/graphql/operations/update-person-status.graphql?raw';
import updateCompanyStatusSource from '@/graphql/operations/update-company-status.graphql?raw';
import linkPersonCompanySource from '@/graphql/operations/link-person-company.graphql?raw';
import unlinkPersonCompanySource from '@/graphql/operations/unlink-person-company.graphql?raw';

export interface SaveCrmPersonInput {
  linkedinUrn: string;
  profileUrl?: string;
  firstName?: string;
  lastName?: string;
  headline?: string;
  location?: string;
  currentTitle?: string;
  currentCompanyName?: string;
  currentCompanyLinkedinUrn?: string;
  profileImageUrl?: string;
}

export interface SaveCrmCompanyInput {
  linkedinUrn: string;
  name: string;
  profileUrl?: string;
  industry?: string;
  website?: string;
  description?: string;
  location?: string;
  employeeCountRange?: string;
  logoUrl?: string;
}

export function useCrmSave() {
  const personMutation = useMutation<
    { savePerson: { id: string; linkedinUrn: string; lifecycleStage: string; connectionStatus: string; outreachStatus: string } },
    { input: SaveCrmPersonInput }
  >(gql(saveCrmPersonSource) as DocumentNode);
  const companyMutation = useMutation<
    { saveCompany: { id: string; linkedinUrn: string; lifecycleStage: string; accountClassification: string } },
    { input: SaveCrmCompanyInput }
  >(gql(saveCrmCompanySource) as DocumentNode);
  const personRemoval = useMutation<{ deletePerson: boolean }, { personId: string }>(gql(deleteCrmPersonSource) as DocumentNode);
  const companyRemoval = useMutation<{ deleteCompany: boolean }, { companyId: string }>(gql(deleteCrmCompanySource) as DocumentNode);
  const companyStatusMutation = useMutation<{ updateCompanyStatus: { id: string; lifecycleStage: string; accountClassification: string } }, { companyId: string; lifecycleStage?: string; accountClassification?: string }>(gql(updateCompanyStatusSource) as DocumentNode);
  const linkPersonCompanyMutation = useMutation<{ linkPersonToCompany: { id: string } }, { personId: string; companyId: string; roleTitle?: string; isCurrent?: boolean }>(gql(linkPersonCompanySource) as DocumentNode);
  const unlinkPersonCompanyMutation = useMutation<{ unlinkPersonFromCompany: { id: string } }, { personId: string; companyId: string }>(gql(unlinkPersonCompanySource) as DocumentNode);
  const personStatusMutation = useMutation<{ updatePersonStatus: { id: string; lifecycleStage: string; connectionStatus: string; outreachStatus: string } }, { personId: string; lifecycleStage?: string; connectionStatus?: string; outreachStatus?: string }>(gql(updatePersonStatusSource) as DocumentNode);

  return {
    savePerson: personMutation.mutate,
    saveCompany: companyMutation.mutate,
    deletePerson: personRemoval.mutate,
    deleteCompany: companyRemoval.mutate,
    updatePersonStatus: personStatusMutation.mutate,
    updateCompanyStatus: companyStatusMutation.mutate,
    linkPersonToCompany: linkPersonCompanyMutation.mutate,
    unlinkPersonFromCompany: unlinkPersonCompanyMutation.mutate,
    savingPerson: personMutation.loading,
    savingCompany: companyMutation.loading,
    removingPerson: personRemoval.loading,
    removingCompany: companyRemoval.loading,
  };
}
