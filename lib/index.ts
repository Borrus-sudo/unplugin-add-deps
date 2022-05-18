import { transform } from "@babel/core";
import * as t from "@babel/types";
import { createUnplugin } from "unplugin";

function isReactComponent(id) {
  return id.charAt(0).toUpperCase() === id.charAt(0);
}

function isReactIdentifierRecordHook(id) {
  return [
    "useState",
    "useReducer",
    "useContext",
    "useRef",
    "useDebugValue",
    "useDeferredValue",
  ].includes(id);
}

function isReactAddDepHook(id) {
  return [
    "useEffect",
    "useCallback",
    "useMemo",
    "useImperativeHandle",
    "useLayoutEffect",
  ].includes(id);
}

function isFunctionExpress(node) {
  return t.isArrowFunctionExpression(node) || t.isFunctionExpression(node);
}

function addDepsToHook(node, identifiers) {
  if (
    isFunctionExpress(node.arguments[0]) &&
    t.isArrayExpression(node.arguments[1])
  ) {
    t.traverse(node.arguments[0], {
      enter(identifierNode) {
        if (
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

function returnComponentVisitor(props) {
  const identifiers = [...props];
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
            identifiers.push(...path.node.id.elements);
          }
        }
      }
    },
    CallExpression(path) {
      //path.node is FunctionNode
      if (t.isIdentifier(path.node.callee)) {
        const { name } = path.node.callee;
        const comment = path.node?.leadingComments?.[0];
        if (isReactAddDepHook(name) && comment?.value !== "ignore") {
          //figuring out what is used and using it
          addDepsToHook(path.node, identifiers);
        }
      }
    },
  };
}

export const createBabelPlugin = () => {
  return {
    visitor: {
      FunctionDeclaration(path) {
        const { id } = path.node;
        if (t.isIdentifier(id) && isReactComponent(id.name)) {
          const props = [];
          path.node.params.forEach((param) => {
            t.traverse(param, {
              enter(propsNode) {
                if (t.isIdentifier(propsNode)) {
                  props.push(propsNode);
                }
              },
            });
          });
          path.traverse(returnComponentVisitor(props));
        }
      },
    },
  };
};

const plugins = createUnplugin((opts) => {
  return {
    name: "unplugin-add-deps",
    transformInclude(id) {
      return /\.(j|t)sx$/.test(id);
    },
    transform(code) {
      const { code: transformedCode } = transform(code, {
        plugins: [createBabelPlugin()],
      });
      return transformedCode;
    },
  };
});

export const vite = plugins.vite;
export const esbuild = plugins.esbuild;
export const rollup = plugins.rollup;
export const webpack = plugins.webpack;
export const babel = createBabelPlugin();
