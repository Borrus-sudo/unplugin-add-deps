import { transform } from "@babel/core";
import { TraverseOptions } from "@babel/traverse";
import * as t from "@babel/types";
import { identifier } from "@babel/types";
import { createUnplugin } from "unplugin";

function isReactComponent(id: string) {
  return id.charAt(0).toUpperCase() === id.charAt(0);
}

function isReactIdentifierRecordHook(id: string) {
  return [
    "useState",
    "useReducer",
    "useContext",
    "useRef",
    "useDebugValue",
    "useDeferredValue",
  ].includes(id);
}

function isReactAddDepHook(id: string) {
  return [
    "useEffect",
    "useCallback",
    "useMemo",
    "useImperativeHandle",
    "useLayoutEffect",
  ].includes(id);
}

function returnComponentVisitor(props: Record<string, string>) {
  const identifiers: t.Identifier[] = [];
  return {
    VariableDeclarator(path) {
      if (
        t.isCallExpression(path.node.init) &&
        t.isIdentifier(path.node.init.callee)
      ) {
        const {
          callee: { name },
        } = path.node.init;
        if (isReactIdentifierRecordHook(name)) {
          if (t.isArrayPattern(path.node.id)) {
            identifiers.push(...(path.node.id.elements as t.Identifier[]));
          }
        } else if (isReactAddDepHook(name)) {
          // well figure out what is used and add it
          const node = path.node.init;
          if (
            (t.isArrowFunctionExpression(node.arguments[0]) ||
              t.isFunctionExpression(node.arguments[0])) &&
            t.isArrayExpression(node.arguments[1])
          ) {
            // extract identifiers used from node.arguments[0]
            console.log("proved true");
            t.traverse(node.arguments[0], {
              enter(identifierNode) {
                if (
                  t.isIdentifier(identifierNode) &&
                  identifiers.some((identifier) =>
                    t.isNodesEquivalent(identifier, identifierNode),
                  )
                ) {
                  node.arguments[1].elements.push(identifierNode);
                }
              },
            });
          }
        }
      }
    },
    CallExpression(path) {
      if (t.isIdentifier(path.node.callee)) {
        const { name } = path.node.callee;
        if (isReactAddDepHook(name)) {
          //figuring out what is used and using it
        }
      }
    },
  } as TraverseOptions<unknown>;
}

const plugins = createUnplugin((opts) => {
  return {
    name: "unplugin-add-deps",
    transformInclude(id) {
      return /\.(j|t)sx$/.test(id);
    },
    transform(code: string) {
      const { code: code1 } = transform(code, {
        plugins: [
          {
            visitor: {
              FunctionDeclaration(path) {
                const { id } = path.node;
                if (t.isIdentifier(id) && isReactComponent(id.name)) {
                  path.traverse(returnComponentVisitor({}));
                }
              },
            },
          },
        ],
      });
      console.log(code1);
      return code1;
    },
  };
});

export const vite = plugins.vite;
