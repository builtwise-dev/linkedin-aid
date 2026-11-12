import { gql, type DocumentNode } from '@apollo/client';
import { useMutation } from '@vue/apollo-composable';
import saveCrmCompanySource from '@/graphql/operations/save-crm-company.graphql?raw';
import saveCrmLeadSource from '@/graphql/operations/save-crm-lead.graphql?raw';
import unsaveCrmLeadSource from '@/graphql/operations/unsave-crm-lead.graphql?raw';
import deleteCrmCompanySource from '@/graphql/operations/delete-crm-company.graphql?raw';

export interface SaveCrmLeadInput {
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
  const leadMutation = useMutation<
    { saveLead: { id: string; linkedinUrn: string; status: string } },
    { input: SaveCrmLeadInput }
  >(gql(saveCrmLeadSource) as DocumentNode);
  const companyMutation = useMutation<
    { saveCompany: { id: string; linkedinUrn: string; status: string } },
    { input: SaveCrmCompanyInput }
  >(gql(saveCrmCompanySource) as DocumentNode);
  const leadRemoval = useMutation<{ unsaveLead: boolean }, { leadId: string }>(gql(unsaveCrmLeadSource) as DocumentNode);
  const companyRemoval = useMutation<{ deleteCompany: boolean }, { companyId: string }>(gql(deleteCrmCompanySource) as DocumentNode);

  return {
    saveLead: leadMutation.mutate,
    saveCompany: companyMutation.mutate,
    unsaveLead: leadRemoval.mutate,
    deleteCompany: companyRemoval.mutate,
    savingLead: leadMutation.loading,
    savingCompany: companyMutation.loading,
    removingLead: leadRemoval.loading,
    removingCompany: companyRemoval.loading,
  };
}
