/**
 * Credit to geist-ui/react for this file, it's copied from there.
 */
import React, { ReactChild, ReactElement, ReactNode } from 'react';
type ReactChildArray = ReturnType<typeof React.Children.toArray>;
export declare function flattenChildrenKeyless(children: React.ReactNode): ReactChildArray;
export declare function flattenChildren(children: ReactNode, depth?: number, keys?: (string | number)[]): ReactChild[];
export declare const pickChildren: <Props = any>(_children: React.ReactNode | undefined, targetChild: React.ElementType) => {
    targetChildren: React.ReactElement<Props, string | React.JSXElementConstructor<any>>[] | undefined;
    withoutTargetChildren: React.ReactChild[];
};
export declare const isInstanceOfComponent: (element: React.ReactElement | React.ReactChild | undefined, targetElement: React.ElementType) => boolean;
export declare const filterNull: <T extends unknown>(t: T) => t is NonNullable<T>;
export declare const create: <Props extends {}>(Component: React.ComponentType<Props>, displayName: string) => React.FC<Props>;
export {};
//# sourceMappingURL=utils.d.ts.map