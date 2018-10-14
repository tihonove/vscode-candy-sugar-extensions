import { SugarElementInfo } from "../Suggester/SugarElementInfo";

import { choice } from "./ChoiceElements/choice";
import { otherwise } from "./ChoiceElements/otherwise";
import { when } from "./ChoiceElements/when";
import { build } from "./ContentElements/build";
import { content } from "./ContentElements/content";
import { deyt } from "./ContentElements/deyt";
import { document_cretaion_date } from "./ContentElements/document_cretaion_date";
import { email } from "./ContentElements/email";
import { e_mail } from "./ContentElements/e_mail";
import { inv } from "./ContentElements/inv";
import { kat } from "./ContentElements/kat";
import { katpos } from "./ContentElements/katpos";
import { kokpo } from "./ContentElements/kokpo";
import { kpp } from "./ContentElements/kpp";
import { leader_fio } from "./ContentElements/leader_fio";
import { local } from "./ContentElements/local";
import { mail } from "./ContentElements/mail";
import { mal_vb_j } from "./ContentElements/mal_vb_j";
import { mest } from "./ContentElements/mest";
import { min_okpo1 } from "./ContentElements/min_okpo1";
import { name } from "./ContentElements/name";
import { nom } from "./ContentElements/nom";
import { okato } from "./ContentElements/okato";
import { okcm } from "./ContentElements/okcm";
import { okfs } from "./ContentElements/okfs";
import { okogu } from "./ContentElements/okogu";
import { okpo } from "./ContentElements/okpo";
import { okpo1t } from "./ContentElements/okpo1t";
import { okpo_2 } from "./ContentElements/okpo_2";
import { oktmo } from "./ContentElements/oktmo";
import { okved } from "./ContentElements/okved";
import { okved_out } from "./ContentElements/okved_out";
import { org_adress } from "./ContentElements/org_adress";
import { org_type } from "./ContentElements/org_type";
import { perfedzelpr } from "./ContentElements/perfedzelpr";
import { period } from "./ContentElements/period";
import { phone } from "./ContentElements/phone";
import { pos } from "./ContentElements/pos";
import { prd } from "./ContentElements/prd";
import { prsek } from "./ContentElements/prsek";
import { responsible_fio } from "./ContentElements/responsible_fio";
import { responsible_post } from "./ContentElements/responsible_post";
import { sd } from "./ContentElements/sd";
import { sekdel } from "./ContentElements/sekdel";
import { sektor } from "./ContentElements/sektor";
import { sred } from "./ContentElements/sred";
import { stroyka } from "./ContentElements/stroyka";
import { struk } from "./ContentElements/struk";
import { togs } from "./ContentElements/togs";
import { typl } from "./ContentElements/typl";
import { vid } from "./ContentElements/vid";
import { year } from "./ContentElements/year";
import { elseElement, ifElement, then } from "./ControlFlowElements/if";
import { attachments } from "./DataElements/attachments";
import { checkbox } from "./DataElements/checkbox";
import { combobox } from "./DataElements/combobox";
import { date } from "./DataElements/date";
import { diadocSuggestComboBox } from "./DataElements/diadocSuggestComboBox";
import { digest } from "./DataElements/digest";
import { fileloader } from "./DataElements/fileloader";
import { fio } from "./DataElements/fio";
import { highlight } from "./DataElements/highlight";
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
import { Checkbox, Column, Row } from "./InvalidElementCaseWorkaround";
import { block } from "./LayoutElement/block";
import { bold } from "./LayoutElement/bold";
import { br } from "./LayoutElement/br";
import { caption } from "./LayoutElement/caption";
import { entity } from "./LayoutElement/entity";
import { gray } from "./LayoutElement/gray";
import { header } from "./LayoutElement/header";
import { help } from "./LayoutElement/help";
import { hr } from "./LayoutElement/hr";
import { icon } from "./LayoutElement/icon";
import { italic } from "./LayoutElement/italic";
import { linetext } from "./LayoutElement/linetext";
import { strong } from "./LayoutElement/strong";
import { sub } from "./LayoutElement/sub";
import { subheader } from "./LayoutElement/subheader";
import { sup } from "./LayoutElement/sup";
import { warning } from "./LayoutElement/warning";
import { item } from "./ListElements/item";
import { list } from "./ListElements/list";
import { infoip } from "./StrangeElements/infoip";
import { infoorg } from "./StrangeElements/infoorg";
import { sign } from "./StrangeElements/sign";
import { form } from "./SystemElements/form";
import { normativehelp } from "./SystemElements/normativehelp";
import { sugar } from "./SystemElements/sugar";
import { column } from "./TableElements/column";
import { multiline } from "./TableElements/multiline";
import { row } from "./TableElements/row";
import { table } from "./TableElements/table";
import { addRowButton } from "./TourElements/addRowButton";
import { enterEvent } from "./TourElements/enterEvent";
import { startTour } from "./TourElements/startTour";
import { totalAmount } from "./TourElements/totalAmount";
import { tour } from "./TourElements/tour";
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
import { address, corrnumber, cross, ferm_vb_j, force, ifns, reorganization, signer } from "./UnclassifiedElements";

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
