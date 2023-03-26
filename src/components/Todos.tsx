
"use client";

import { useState } from 'react';
import { Heart } from '@/components/icons/Heart';
import { Close } from '@/components/icons/Close';
import { AddTodo } from '@/components/AddTodo';
import { client } from '@/lib/client';
import { gql } from 'graphql-request';

export type Todo = {
  id: number;
  desc: string;
  finished: boolean;
};

type TodosProps = {
  listId: number;
  list: Todo[];
};

const CREATE_TODO_MUTATION = gql`
mutation AddTODO($listId: Int!, $desc: String!) {
  addTODO(listId: $listId, desc: $desc) {
    id
    desc
    finished
  }
}
`;

const REMOVE_TODO_MUTATION = gql`
mutation Mutation($removeTodoId: Int!, $listId: Int!) {
  removeTODO(id: $removeTodoId, listId: $listId)
}
`;

const FINISH_TODO_MUTATION = gql`
mutation FinishTODO($finishTodoId: Int!, $listId: Int!) {
  finishTODO(id: $finishTodoId, listId: $listId) {
    finished
    desc
    id
  }
}
`;

export const Todos = ({ list = [], listId }: TodosProps) => {

  const [todos, setTodos] = useState<Todo[]>(list);
  const onAddHandler = async (desc: string) => {
    const res = await client.request<{ addTODO: Todo }>(CREATE_TODO_MUTATION, {
      listId: listId,
      desc: desc,
    });
    setTodos([...todos, res.addTODO]);
  };

  const onRemoveHandler = async (id: number) => {
    await client.request<{ removeTodo: Todo }>(REMOVE_TODO_MUTATION, {
      listId: listId,
      removeTodoId: id,
    });
    const newTodos = todos.filter((todo) => todo.id !== id);
    setTodos(newTodos);
  };

  const onFinishHandler = async (id: number) => {
    await client.request<{ finishTodo: Todo }>(FINISH_TODO_MUTATION, {
      finishTodoId: id,
      listId: listId,
    });
    const newTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, finished: true } : todo
    );
    setTodos(newTodos);
  };

  return (
    <div>
      <h2 className="text-center text-5xl mb-10">My TODO list</h2>
      <ul>
        {todos.map((item) => (
          <li
            key={item.id}
            className="py-2 pl-4 pr-2 bg-gray-900 rounded-lg mb-4 flex justify-between items-center min-h-16"
          >
            <p className={item.finished ? 'line-through' : ''}>{item.desc}</p>
            {!item.finished && (
              <div className="flex gap-2">
                <button
                  className="btn btn-square btn-accent"
                  onClick={() => onFinishHandler(item.id)}
                >
                  <Heart />
                </button>
                <button
                  className="btn btn-square btn-error"
                  onClick={() => onRemoveHandler(item.id)}
                >
                  <Close />
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
      <AddTodo onAdd={onAddHandler} />
    </div>
  );
};