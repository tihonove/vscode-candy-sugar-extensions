import { AvailableChildrenType, SugarElementInfo } from "../Suggester/SugarElementInfo";

import { form } from "./form";
import { help } from "./help";
import { icon } from "./icon";
import { normativehelp } from "./normativehelp";
import { content } from "./ContentElements/content";
import { deyt } from "./ContentElements/deyt";
import { document_cretaion_date } from "./ContentElements/document_cretaion_date";
import { email } from "./ContentElements/email";
import { leader_fio } from "./ContentElements/leader_fio";
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
import { fio } from "./DataElements/fio";
import { inn } from "./DataElements/inn";
import { input } from "./DataElements/input";
import { kladr } from "./DataElements/kladr";
import { link } from "./DataElements/link";
import { page } from "./DataElements/page";
import { picklist } from "./DataElements/picklist";
import { radio } from "./DataElements/radio";
import { radiogroup } from "./DataElements/radiogroup";
import { text } from "./DataElements/text";
import { gridCol, gridRow } from "./GridElements/grid";
import { block } from "./LayoutElement/block";
import { caption } from "./LayoutElement/caption";
import { gray } from "./LayoutElement/gray";
import { header } from "./LayoutElement/header";
import { hr } from "./LayoutElement/hr";
import { warning } from "./LayoutElement/warning";
import { item } from "./ListElements/item";
import { list } from "./ListElements/list";
import { ifElement } from "./StrangeElements/if";
import { column } from "./TableElements/column";
import { multiline } from "./TableElements/multiline";
import { row } from "./TableElements/row";
import { table } from "./TableElements/table";
import { customValidation } from "./TypeDefinitionElements/customValidation";
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

const Row: SugarElementInfo = { name: "Row", availableChildren: { type: AvailableChildrenType.Any } };
const Column: SugarElementInfo = { name: "Column", availableChildren: { type: AvailableChildrenType.Any } };
const Checkbox: SugarElementInfo = { name: "Checkbox", availableChildren: { type: AvailableChildrenType.Any } };

const digestCheck: SugarElementInfo = { name: "digestCheck", availableChildren: { type: AvailableChildrenType.Any } };
const entity: SugarElementInfo = { name: "entity", availableChildren: { type: AvailableChildrenType.Any } };
const tour: SugarElementInfo = { name: "tour", availableChildren: { type: AvailableChildrenType.Any } };
const startTour: SugarElementInfo = { name: "startTour", availableChildren: { type: AvailableChildrenType.Any } };
const addRowButton: SugarElementInfo = { name: "addRowButton", availableChildren: { type: AvailableChildrenType.Any } };
const totalAmount: SugarElementInfo = { name: "totalAmount", availableChildren: { type: AvailableChildrenType.Any } };
const enterEvent: SugarElementInfo = { name: "enterEvent", availableChildren: { type: AvailableChildrenType.Any } };
const force: SugarElementInfo = { name: "force", availableChildren: { type: AvailableChildrenType.Any } };
const attachments: SugarElementInfo = { name: "attachments", availableChildren: { type: AvailableChildrenType.Any } };
const textarea: SugarElementInfo = { name: "textarea", availableChildren: { type: AvailableChildrenType.Any } };
const fileloader: SugarElementInfo = { name: "fileloader", availableChildren: { type: AvailableChildrenType.Any } };
const okfs: SugarElementInfo = { name: "okfs", availableChildren: { type: AvailableChildrenType.Any } };
const e_mail: SugarElementInfo = { name: "e_mail", availableChildren: { type: AvailableChildrenType.Any } };
const okcm: SugarElementInfo = { name: "okcm", availableChildren: { type: AvailableChildrenType.Any } };
const inv: SugarElementInfo = { name: "inv", availableChildren: { type: AvailableChildrenType.Any } };
const okved_out: SugarElementInfo = { name: "okved_out", availableChildren: { type: AvailableChildrenType.Any } };
const mail: SugarElementInfo = { name: "mail", availableChildren: { type: AvailableChildrenType.Any } };
const okato: SugarElementInfo = { name: "okato", availableChildren: { type: AvailableChildrenType.Any } };
const mal_vb_j: SugarElementInfo = { name: "mal_vb_j", availableChildren: { type: AvailableChildrenType.Any } };
const nom: SugarElementInfo = { name: "nom", availableChildren: { type: AvailableChildrenType.Any } };
const prsek: SugarElementInfo = { name: "prsek", availableChildren: { type: AvailableChildrenType.Any } };
const vid: SugarElementInfo = { name: "vid", availableChildren: { type: AvailableChildrenType.Any } };
const sektor: SugarElementInfo = { name: "sektor", availableChildren: { type: AvailableChildrenType.Any } };
const oktmo: SugarElementInfo = { name: "oktmo", availableChildren: { type: AvailableChildrenType.Any } };
const org_adress: SugarElementInfo = { name: "org_adress", availableChildren: { type: AvailableChildrenType.Any } };
const org_type: SugarElementInfo = { name: "org_type", availableChildren: { type: AvailableChildrenType.Any } };
const sd: SugarElementInfo = { name: "sd", availableChildren: { type: AvailableChildrenType.Any } };
const typl: SugarElementInfo = { name: "typl", availableChildren: { type: AvailableChildrenType.Any } };
const katpos: SugarElementInfo = { name: "katpos", availableChildren: { type: AvailableChildrenType.Any } };
const sekdel: SugarElementInfo = { name: "sekdel", availableChildren: { type: AvailableChildrenType.Any } };
const kokpo: SugarElementInfo = { name: "kokpo", availableChildren: { type: AvailableChildrenType.Any } };
const sred: SugarElementInfo = { name: "sred", availableChildren: { type: AvailableChildrenType.Any } };
const okpo1t: SugarElementInfo = { name: "okpo1t", availableChildren: { type: AvailableChildrenType.Any } };
const struk: SugarElementInfo = { name: "struk", availableChildren: { type: AvailableChildrenType.Any } };
const ferm_vb_j: SugarElementInfo = { name: "ferm_vb_j", availableChildren: { type: AvailableChildrenType.Any } };
const prd: SugarElementInfo = { name: "prd", availableChildren: { type: AvailableChildrenType.Any } };
const pos: SugarElementInfo = { name: "pos", availableChildren: { type: AvailableChildrenType.Any } };
const kat: SugarElementInfo = { name: "kat", availableChildren: { type: AvailableChildrenType.Any } };
const mest: SugarElementInfo = { name: "mest", availableChildren: { type: AvailableChildrenType.Any } };
const stroyka: SugarElementInfo = { name: "stroyka", availableChildren: { type: AvailableChildrenType.Any } };
const min_okpo1: SugarElementInfo = { name: "min_okpo1", availableChildren: { type: AvailableChildrenType.Any } };
const perfedzelpr: SugarElementInfo = { name: "perfedzelpr", availableChildren: { type: AvailableChildrenType.Any } };
const build: SugarElementInfo = { name: "build", availableChildren: { type: AvailableChildrenType.Any } };
const address: SugarElementInfo = { name: "address", availableChildren: { type: AvailableChildrenType.Any } };
const okogu: SugarElementInfo = { name: "okogu", availableChildren: { type: AvailableChildrenType.Any } };
const okpo_2: SugarElementInfo = { name: "okpo_2", availableChildren: { type: AvailableChildrenType.Any } };
const diadocSuggestComboBox: SugarElementInfo = {
    name: "diadocSuggestComboBox",
    availableChildren: { type: AvailableChildrenType.Any },
};

const corrnumber: SugarElementInfo = { name: "corrnumber", availableChildren: { type: AvailableChildrenType.Any } };
const cross: SugarElementInfo = { name: "cross", availableChildren: { type: AvailableChildrenType.Any } };
const digest: SugarElementInfo = { name: "digest", availableChildren: { type: AvailableChildrenType.Any } };
const elseElement: SugarElementInfo = { name: "else", availableChildren: { type: AvailableChildrenType.Any } };
const highlight: SugarElementInfo = { name: "highlight", availableChildren: { type: AvailableChildrenType.Any } };
const ifns: SugarElementInfo = { name: "ifns", availableChildren: { type: AvailableChildrenType.Any } };
const infoip: SugarElementInfo = { name: "infoip", availableChildren: { type: AvailableChildrenType.Any } };
const infoorg: SugarElementInfo = { name: "infoorg", availableChildren: { type: AvailableChildrenType.Any } };
const italic: SugarElementInfo = { name: "italic", availableChildren: { type: AvailableChildrenType.Any } };
const kpp: SugarElementInfo = { name: "kpp", availableChildren: { type: AvailableChildrenType.Any } };
const linetext: SugarElementInfo = { name: "linetext", availableChildren: { type: AvailableChildrenType.Any } };
const local: SugarElementInfo = { name: "local", availableChildren: { type: AvailableChildrenType.Any } };
const okved: SugarElementInfo = { name: "okved", availableChildren: { type: AvailableChildrenType.Any } };
const otherwise: SugarElementInfo = { name: "otherwise", availableChildren: { type: AvailableChildrenType.Any } };
const reorganization: SugarElementInfo = {
    name: "reorganization",
    availableChildren: { type: AvailableChildrenType.Any },
};
const select: SugarElementInfo = { name: "select", availableChildren: { type: AvailableChildrenType.Any } };
const sign: SugarElementInfo = { name: "sign", availableChildren: { type: AvailableChildrenType.Any } };
const signer: SugarElementInfo = { name: "signer", availableChildren: { type: AvailableChildrenType.Any } };
const strong: SugarElementInfo = { name: "strong", availableChildren: { type: AvailableChildrenType.Any } };
const sub: SugarElementInfo = { name: "sub", availableChildren: { type: AvailableChildrenType.Any } };
const subheader: SugarElementInfo = { name: "subheader", availableChildren: { type: AvailableChildrenType.Any } };
const sugar: SugarElementInfo = { name: "sugar", availableChildren: { type: AvailableChildrenType.Any } };
const sup: SugarElementInfo = { name: "sup", availableChildren: { type: AvailableChildrenType.Any } };
const then: SugarElementInfo = { name: "then", availableChildren: { type: AvailableChildrenType.Any } };
const when: SugarElementInfo = { name: "when", availableChildren: { type: AvailableChildrenType.Any } };
const bold: SugarElementInfo = { name: "bold", availableChildren: { type: AvailableChildrenType.Any } };
const br: SugarElementInfo = { name: "br", availableChildren: { type: AvailableChildrenType.NoChildren } };
const choice: SugarElementInfo = { name: "choice", availableChildren: { type: AvailableChildrenType.Any } };

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
