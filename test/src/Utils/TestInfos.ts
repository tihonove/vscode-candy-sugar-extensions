import { DataSchemaElementNode } from "../../../server/src/DataSchema/DataSchemaNode";
import {
    AttributeTypeKind,
    AttributeTypes,
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
                valueTypes: [AttributeTypes.Path],
            },
            {
                name: "type",
                valueTypes: [AttributeTypes.Type],
                required: false,
            },
            {
                name: "optional-attr",
                valueTypes: [AttributeTypes.String],
            },
            {
                name: "required-attr",
                valueTypes: [AttributeTypes.Number],
                required: true,
            },
            {
                name: "number-attr",
                valueTypes: [AttributeTypes.Boolean],
                required: true,
            },
            {
                name: "boolean-attr",
                valueTypes: [AttributeTypes.Boolean],
            },
            {
                name: "enum-attr",
                valueTypes: [{ type: AttributeTypeKind.Enum, values: ["value1", "value2"] }],
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
                valueTypes: [AttributeTypes.Path],
            },
            {
                name: "type",
                valueTypes: [AttributeTypes.Type],
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
                valueTypes: [AttributeTypes.Path],
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

export const testTemplatesSugarElementInfos: SugarElementInfo[] = [
    {
        name: "templateName",
        createPathScope: true,
        availableChildren: {
            type: AvailableChildrenType.Any,
        },
    },
];
