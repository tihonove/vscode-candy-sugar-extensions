import {
    AttributeType,
    AvailableChildrenType,
    SugarAttributeInfo,
    SugarElementInfo,
} from "../Suggester/SugarElementInfo";

import { attachments } from "./attachments";
import { digest } from "./digest";
import { form } from "./form";
import { help } from "./help";
import { icon } from "./icon";
import { normativehelp } from "./normativehelp";
import { sugar } from "./sugar";
import { choice } from "./ChoiceElements/choice";
import { otherwise } from "./ChoiceElements/otherwise";
import { when } from "./ChoiceElements/when";
import { pathAttribute } from "./Commons/pathAttribute";
import { content } from "./ContentElements/content";
import { deyt } from "./ContentElements/deyt";
import { document_cretaion_date } from "./ContentElements/document_cretaion_date";
import { email } from "./ContentElements/email";
import { kpp } from "./ContentElements/kpp";
import { leader_fio } from "./ContentElements/leader_fio";
import { local } from "./ContentElements/local";
import { name } from "./ContentElements/name";
import { okpo } from "./ContentElements/okpo";
import { period } from "./ContentElements/period";
import { phone } from "./ContentElements/phone";
import { responsible_fio } from "./ContentElements/responsible_fio";
import { responsible_post } from "./ContentElements/responsible_post";
import { togs } from "./ContentElements/togs";
import { year } from "./ContentElements/year";
import { checkbox } from "./DataElements/checkbox";
import { combobox } from "./DataElements/combobox";
import { date } from "./DataElements/date";
import { diadocSuggestComboBox } from "./DataElements/diadocSuggestComboBox";
import { fileloader } from "./DataElements/fileloader";
import { fio } from "./DataElements/fio";
import { inn } from "./DataElements/inn";
import { input } from "./DataElements/input";
import { kladr } from "./DataElements/kladr";
import { link } from "./DataElements/link";
import { page } from "./DataElements/page";
import { picklist } from "./DataElements/picklist";
import { radio } from "./DataElements/radio";
import { radiogroup } from "./DataElements/radiogroup";
import { select } from "./DataElements/select";
import { text } from "./DataElements/text";
import { textarea } from "./DataElements/textarea";
import { gridCol, gridRow } from "./GridElements/grid";
import { block } from "./LayoutElement/block";
import { caption } from "./LayoutElement/caption";
import { entity } from "./LayoutElement/entity";
import { gray } from "./LayoutElement/gray";
import { header } from "./LayoutElement/header";
import { hr } from "./LayoutElement/hr";
import { linetext } from "./LayoutElement/linetext";
import { warning } from "./LayoutElement/warning";
import { item } from "./ListElements/item";
import { list } from "./ListElements/list";
import { elseElement, ifElement, then } from "./StrangeElements/if";
import { column } from "./TableElements/column";
import { multiline } from "./TableElements/multiline";
import { row } from "./TableElements/row";
import { table } from "./TableElements/table";
import { customValidation } from "./TypeDefinitionElements/customValidation";
import { digestCheck } from "./TypeDefinitionElements/digestCheck";
import { enumeration } from "./TypeDefinitionElements/enumeration";
import { fractionDigits } from "./TypeDefinitionElements/fractionDigits";
import { integerDigits } from "./TypeDefinitionElements/integerDigits";
import { length } from "./TypeDefinitionElements/length";
import { maxInclusive } from "./TypeDefinitionElements/maxInclusive";
import { maxLength } from "./TypeDefinitionElements/maxLength";
import { minInclusive } from "./TypeDefinitionElements/minInclusive";
import { minLength } from "./TypeDefinitionElements/minLength";
import { pattern } from "./TypeDefinitionElements/pattern";
import { totalDigits } from "./TypeDefinitionElements/totalDigits";
import { typeElement } from "./TypeDefinitionElements/type";
import { types } from "./TypeDefinitionElements/types";

// Just elements
const force: SugarElementInfo = { name: "force", availableChildren: { type: AvailableChildrenType.Any } };
const ferm_vb_j: SugarElementInfo = { name: "ferm_vb_j", availableChildren: { type: AvailableChildrenType.Any } };
const address: SugarElementInfo = { name: "address", availableChildren: { type: AvailableChildrenType.Any } };
const corrnumber: SugarElementInfo = { name: "corrnumber", availableChildren: { type: AvailableChildrenType.Any } };
const cross: SugarElementInfo = { name: "cross", availableChildren: { type: AvailableChildrenType.Any } };
const ifns: SugarElementInfo = { name: "ifns", availableChildren: { type: AvailableChildrenType.Any } };
const reorganization: SugarElementInfo = {
    name: "reorganization",
    availableChildren: { type: AvailableChildrenType.Any },
};
const signer: SugarElementInfo = { name: "signer", availableChildren: { type: AvailableChildrenType.Any } };

// buggy =============================================================
const Row: SugarElementInfo = { ...row, name: "Row" };
const Column: SugarElementInfo = { ...column, name: "Column" };
const Checkbox: SugarElementInfo = { ...checkbox, name: "Checkbox" };

// Tour options =============================================================
const tour: SugarElementInfo = { name: "tour", availableChildren: { type: AvailableChildrenType.Any } };
const startTour: SugarElementInfo = { name: "startTour", availableChildren: { type: AvailableChildrenType.Any } };
const addRowButton: SugarElementInfo = { name: "addRowButton", availableChildren: { type: AvailableChildrenType.Any } };
const enterEvent: SugarElementInfo = { name: "enterEvent", availableChildren: { type: AvailableChildrenType.Any } };
const totalAmount: SugarElementInfo = { name: "totalAmount", availableChildren: { type: AvailableChildrenType.Any } };

// Lyaout =============================================================
const italic: SugarElementInfo = { name: "italic", availableChildren: { type: AvailableChildrenType.Any } };
const bold: SugarElementInfo = { name: "bold", availableChildren: { type: AvailableChildrenType.Any } };
const br: SugarElementInfo = { name: "br", availableChildren: { type: AvailableChildrenType.NoChildren } };
const sub: SugarElementInfo = { name: "sub", availableChildren: { type: AvailableChildrenType.Any } };
const strong: SugarElementInfo = { name: "strong", availableChildren: { type: AvailableChildrenType.Any } };
const subheader: SugarElementInfo = { name: "subheader", availableChildren: { type: AvailableChildrenType.Any } };
const sup: SugarElementInfo = { name: "sup", availableChildren: { type: AvailableChildrenType.Any } };

// Strange mans =============================================================
const infoip: SugarElementInfo = {
    name: "infoip",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: [{ name: "include", valueTypes: [AttributeType.Enum] }],
};

const infoorg: SugarElementInfo = {
    name: "infoorg",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: [{ name: "include", valueTypes: [AttributeType.Enum] }],
};

const sign: SugarElementInfo = {
    name: "sign",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: [{ name: "include", valueTypes: [AttributeType.Enum] }],
};

// content =============================================================
const commonContentAttributes: SugarAttributeInfo[] = [
    { name: "caption", valueTypes: [AttributeType.String], optional: true },
    { name: "gId", valueTypes: [AttributeType.PicklistId], optional: true },
];

const okfs: SugarElementInfo = {
    name: "okfs",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: commonContentAttributes,
};

const kat: SugarElementInfo = {
    name: "kat",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: commonContentAttributes,
};

const build: SugarElementInfo = {
    name: "build",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: commonContentAttributes,
};

const okved: SugarElementInfo = {
    name: "okved",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: commonContentAttributes,
};
const e_mail: SugarElementInfo = {
    name: "e_mail",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: commonContentAttributes,
};
const inv: SugarElementInfo = {
    name: "inv",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: commonContentAttributes,
};
const katpos: SugarElementInfo = {
    name: "katpos",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: commonContentAttributes,
};
const kokpo: SugarElementInfo = {
    name: "kokpo",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: commonContentAttributes,
};
const mal_vb_j: SugarElementInfo = {
    name: "mal_vb_j",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: commonContentAttributes,
};
const mest: SugarElementInfo = {
    name: "mest",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: commonContentAttributes,
};
const min_okpo1: SugarElementInfo = {
    name: "min_okpo1",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: commonContentAttributes,
};
const nom: SugarElementInfo = {
    name: "nom",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: commonContentAttributes,
};
const okato: SugarElementInfo = {
    name: "okato",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: commonContentAttributes,
};
const okcm: SugarElementInfo = {
    name: "okcm",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: [...commonContentAttributes, { name: "name", valueTypes: [AttributeType.String] }],
};
const okogu: SugarElementInfo = {
    name: "okogu",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: commonContentAttributes,
};
const okpo_2: SugarElementInfo = {
    name: "okpo_2",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: commonContentAttributes,
};
const okpo1t: SugarElementInfo = {
    name: "okpo1t",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: commonContentAttributes,
};
const oktmo: SugarElementInfo = {
    name: "oktmo",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: commonContentAttributes,
};
const okved_out: SugarElementInfo = {
    name: "okved_out",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: commonContentAttributes,
};
const org_adress: SugarElementInfo = {
    name: "org_adress",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: commonContentAttributes,
};
const org_type: SugarElementInfo = {
    name: "org_type",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: commonContentAttributes,
};
const perfedzelpr: SugarElementInfo = {
    name: "perfedzelpr",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: commonContentAttributes,
};
const pos: SugarElementInfo = {
    name: "pos",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: commonContentAttributes,
};
const prd: SugarElementInfo = {
    name: "prd",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: [
        ...commonContentAttributes,
        { name: "defaultValue", valueTypes: [AttributeType.String], optional: true },
    ],
};
const prsek: SugarElementInfo = {
    name: "prsek",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: commonContentAttributes,
};
const sd: SugarElementInfo = {
    name: "sd",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: commonContentAttributes,
};
const sekdel: SugarElementInfo = {
    name: "sekdel",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: commonContentAttributes,
};
const sektor: SugarElementInfo = {
    name: "sektor",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: commonContentAttributes,
};
const sred: SugarElementInfo = {
    name: "sred",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: commonContentAttributes,
};
const stroyka: SugarElementInfo = {
    name: "stroyka",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: commonContentAttributes,
};
const struk: SugarElementInfo = {
    name: "struk",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: commonContentAttributes,
};
const typl: SugarElementInfo = {
    name: "typl",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: commonContentAttributes,
};
const vid: SugarElementInfo = {
    name: "vid",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: commonContentAttributes,
};

const highlight: SugarElementInfo = {
    name: "highlight",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: [
        pathAttribute,
        { name: "paths", valueTypes: [AttributeType.PathList] },
        { name: "change", valueTypes: [AttributeType.Enum] },
        { name: "tooltip", valueTypes: [AttributeType.String] },
    ],
};

const mail: SugarElementInfo = {
    name: "mail",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: [{ name: "caption", valueTypes: [AttributeType.String] }],
};

export const allElements: SugarElementInfo[] = [
    Checkbox,
    combobox,
    content,
    corrnumber,
    cross,
    customValidation,
    date,
    digest,
    elseElement,
    enumeration,
    fio,
    fractionDigits,
    gray,
    gridRow,
    gridCol,
    header,
    help,
    highlight,
    hr,
    ifElement,
    ifns,
    infoip,
    infoorg,
    inn,
    integerDigits,
    italic,
    item,
    kladr,
    kpp,
    length,
    linetext,
    list,
    local,
    maxLength,
    minLength,
    multiline,
    name,
    normativehelp,
    okved,
    otherwise,
    pattern,
    period,
    phone,
    picklist,
    radio,
    radiogroup,
    reorganization,
    select,
    sign,
    signer,
    strong,
    sub,
    subheader,
    sugar,
    sup,
    table,
    text,
    then,
    totalDigits,
    typeElement,
    types,
    warning,
    when,
    year,
    column,
    row,
    link,
    icon,
    input,
    page,
    form,
    checkbox,
    block,
    bold,
    br,
    caption,
    choice,
    digestCheck,
    tour,
    startTour,
    addRowButton,
    totalAmount,
    enterEvent,
    force,
    attachments,
    textarea,
    fileloader,
    togs,
    okpo,
    leader_fio,
    responsible_post,
    responsible_fio,
    email,
    okfs,
    e_mail,
    okcm,
    inv,
    okved_out,
    mail,
    minInclusive,
    maxInclusive,
    okato,
    mal_vb_j,
    deyt,
    nom,
    prsek,
    vid,
    sektor,
    oktmo,
    org_adress,
    org_type,
    document_cretaion_date,
    sd,
    typl,
    katpos,
    sekdel,
    kokpo,
    sred,
    okpo1t,
    struk,
    ferm_vb_j,
    prd,
    pos,
    kat,
    mest,
    stroyka,
    min_okpo1,
    perfedzelpr,
    build,
    address,
    okogu,
    okpo_2,
    diadocSuggestComboBox,
    entity,
    Column,
    Row,
];
