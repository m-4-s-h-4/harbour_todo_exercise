import { Todos } from '@/components/Todos';
import { gql } from 'graphql-request';
import { client } from '@/lib/client';

type MyListPageMetadata = {
  params: { listId: string };
}

interface GetTodosResponse {
  desc: string;
  finished: boolean;
  id: number;
}

export async function generateMetadata({ params }: MyListPageMetadata) {
  return {
    title: `TODO List ${params.listId}`,
  };
}

type MyListPageProps = MyListPageMetadata;

const GET_TODOS_QUERY = gql`
query GetTODOs($listId: Int!) {
  getTODOs(listId: $listId) {
    desc
    finished
    id
  }
}
`;

export default async function MyListPage({ params: { listId } }: MyListPageProps) {
  const { getTODOs } = await client.request<{ getTODOs: GetTodosResponse[] }>(GET_TODOS_QUERY, {
    listId: parseInt(listId),
  });
  
  return (
    <div className="flex align-center justify-center p-16 sm:p-8">
      <Todos
        listId={parseInt(listId)}
        list={getTODOs}
      />
    </div>
  );
}