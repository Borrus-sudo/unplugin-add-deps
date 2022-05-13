import { parse } from "@babel/parser";
import traverse, { TraverseOptions } from "@babel/traverse";
import * as t from "@babel/types";
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
    VariableDeclarator: {
      enter(path) {
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
            const stuff = t.getBindingIdentifiers(path.node.init);
            console.log(stuff);
          }
          console.log(name);
          console.log(identifiers);
        }
      },
    },
  } as TraverseOptions<unknown>;
}

const plugins = createUnplugin((opts) => {
  return {
    name: "unplugin-add-deps",
    transformInclude(id) {
      return /\.(j|t)sx/.test(id);
    },
    transform(code: string) {
      const ast = parse(code, { sourceType: "module" });
      const identifiers: t.Identifier[] = [];
      let readAssignments = true;

      traverse(ast, {
        FunctionDeclaration(path) {
          const { id } = path.node;
          if (t.isIdentifier(id) && isReactComponent(id.name)) {
            path.traverse(returnComponentVisitor({}));
          }
        },
      });
      return code;
    },
  };
});

export const vite = plugins.vite;
