declare module "prettier-linter-helpers" {
    type DifferenceOperation = "replace";

    export type SourceDifference =
        | {
              operation: "replace";
              offset: number;
              insertText: string;
              deleteText: string;
          }
        | {
              operation: "insert";
              offset: number;
              insertText: string;
          }
        | {
              operation: "delete";
              offset: number;
              deleteText: string;
          };

    export function showInvisibles(input: string): string;

    export function generateDifferences(source: string, formattedSource: string): SourceDifference[];
}
