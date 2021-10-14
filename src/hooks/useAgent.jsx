import { useContext } from 'react';
import AgentContext from '../contexts/AgentContext';

export const useAgent = () => {
  const context = useContext(AgentContext);
  if (!context) {
    throw new Error(
      `The \`useAgent\` hook must be used inside the <AgentContext> component's context.`,
    );
  }
  return context;
};
