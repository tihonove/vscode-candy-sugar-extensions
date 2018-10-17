import { DataSchemaElementNode } from "../../../server/src/DataSchema/DataSchemaNode";
import {
    AttributeType,
    AvailableChildrenType,
    SugarElementInfo,
} from "../../../server/src/SugarElements/SugarElementInfo";
import { UserDefinedSugarTypeInfo } from "../../../server/src/SugarElements/UserDefinedSugarTypeInfo";

const fakePosition = {
    start: { column: 0, line: 0, offset: 0 },
    end: { column: 0, line: 0, offset: 0 },
};

export const testSugarTypes: UserDefinedSugarTypeInfo[] = [
    {
        name: "a-type1",
        constraintStrings: [],
        position: fakePosition,
    },
    {
        name: "b-type2",
        constraintStrings: [],
        position: fakePosition,
    },
    {
        name: "gYear",
        constraintStrings: [],
        position: fakePosition,
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
                optional: true,
            },
            {
                name: "type",
                valueTypes: [AttributeType.Type],
                optional: true,
            },
            {
                name: "optional-attr",
                valueTypes: [AttributeType.String],
                optional: true,
            },
            {
                name: "required-attr",
                valueTypes: [AttributeType.Number],
                optional: false,
            },
            {
                name: "number-attr",
                valueTypes: [AttributeType.Boolean],
                optional: false,
            },
            {
                name: "boolean-attr",
                valueTypes: [AttributeType.Boolean],
                optional: false,
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
                name: "path",
                valueTypes: [AttributeType.Path],
            },
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

export const testDataSchema: DataSchemaElementNode = {
    name: "",
    type: "DataSchemaElementNode",
    position: fakePosition,
    children: [
        {
            type: "DataSchemaElementNode",
            name: "Root",
            position: fakePosition,
            attributes: [
                {
                    type: "DataSchemaAttribute",
                    name: "attr1",
                    position: fakePosition,
                },
                {
                    type: "DataSchemaAttribute",
                    name: "attr2",
                    position: fakePosition,
                },
            ],
            children: [
                {
                    type: "DataSchemaElementNode",
                    name: "Children1",
                    position: fakePosition,
                    children: [
                        {
                            type: "DataSchemaElementNode",
                            name: "Child1",
                            position: fakePosition,
                            multiple: true,
                            attributes: [
                                {
                                    type: "DataSchemaAttribute",
                                    name: "ChildAttr1",
                                    position: fakePosition,
                                },
                                {
                                    type: "DataSchemaAttribute",
                                    name: "ChildAttr2",
                                    position: fakePosition,
                                },
                            ],
                        },
                    ],
                },
                {
                    type: "DataSchemaElementNode",
                    name: "Child2",
                    position: fakePosition,
                },
            ],
        },
    ],
};
