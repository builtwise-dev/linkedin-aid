import type { CodegenConfig } from '@graphql-codegen/cli';

const endpoint = process.env.WXT_API_URL;

if (!endpoint) {
  throw new Error('Set WXT_API_URL in .env before generating GraphQL types.');
}

const config: CodegenConfig = {
  schema: endpoint,
  documents: ['src/graphql/operations/**/*.graphql'],
  generates: {
    'src/graphql/generated/': {
      preset: 'client',
      config: { useTypeImports: true, enumsAsTypes: true },
    },
  },
};

export default config;
