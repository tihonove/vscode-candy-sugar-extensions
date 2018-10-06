import { DataSchemaNode } from "../../../server/src/DataSchema/DataSchemaNode";
import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../../server/src/Suggester/SugarElementInfo";
import { SugarTypeInfo } from "../../../server/src/Suggester/SugarTypeInfo";

export const testSugarTypes: SugarTypeInfo[] = [
    {
        name: "a-type1",
    },
    {
        name: "b-type2",
    },
];

export const testSugarElementInfos: SugarElementInfo[] = [
    {
        name: "atag1",
        createPathScope: true,
        attributes: [
            {
                name: "path",
                valueTypes: [AttributeType.Path],
            },
        ],
        availableChildren: {
            type: AvailableChildrenType.Any,
        },
    },
    {
        name: "btag2",
        createPathScope: false,
        attributes: [
            {
                name: "type",
                valueTypes: [AttributeType.Type],
            },
        ],
        availableChildren: {
            type: AvailableChildrenType.List,
            list: ["tag3"],
        },
    },
    {
        name: "ctag3",
        createPathScope: true,
        attributes: [
            {
                name: "path",
                valueTypes: [AttributeType.Path],
            },
        ],
        availableChildren: {
            type: AvailableChildrenType.Any,
        },
    },
];

const fakePosition = {
    start: { column: 0, line: 0, offset: 0 },
    end: { column: 0, line: 0, offset: 0 },
};

export const testDataSchema: DataSchemaNode = {
    name: "",
    position: fakePosition,
    children: [
        {
            name: "Root",
            position: fakePosition,
            attributes: [
                {
                    name: "attr1",
                },
                {
                    name: "attr2",
                },
            ],
            children: [
                {
                    name: "Children1",
                    position: fakePosition,
                    children: [
                        {
                            name: "Child1",
                            position: fakePosition,
                            multiple: true,
                            attributes: [
                                {
                                    name: "ChildAttr1",
                                },
                                {
                                    name: "ChildAttr2",
                                },
                            ],
                        },
                    ],
                },
                {
                    name: "Child2",
                    position: fakePosition,
                },
            ],
        },
    ],
};
