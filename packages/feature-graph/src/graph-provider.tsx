import 'xstate';
import { createActorContext } from '@xstate/react';
import { Context, graphMachine } from '@commonalityco/data-graph';

export const GraphContext: ReturnType<
  typeof createActorContext<typeof graphMachine>
> = createActorContext(graphMachine);

export const GraphProvider = ({
  children,
  worker,
  onPackageClick,
}: {
  children?: React.ReactNode;
  worker: Worker;
  onPackageClick: (packageName: string) => void;
}) => {
  return (
    <GraphContext.Provider
      options={{
        context: { worker },
        actions: {
          nodeSelect: (
            _context: Context,
            event: { type: 'NODE_SELECT'; packageName: string },
          ) => {
            onPackageClick(event.packageName);
          },
        },
        delays: {},
        guards: {},
        services: {},
      }}
    >
      {children}
    </GraphContext.Provider>
  );
};

export default GraphProvider;
