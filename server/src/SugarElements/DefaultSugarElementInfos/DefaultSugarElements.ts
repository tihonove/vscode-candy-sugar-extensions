import { SugarElementInfo } from "../SugarElementInfo";

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
import { sugarElementsGroups } from "./DefaultSugarElementsGrouped";
import { Checkbox, Column, Row } from "./InvalidElementCaseWorkaround";
import { item } from "./ListElements/item";
import { list } from "./ListElements/list";
import { infoip } from "./StrangeElements/infoip";
import { infoorg } from "./StrangeElements/infoorg";
import { sign } from "./StrangeElements/sign";
import { address, corrnumber, cross, ferm_vb_j, force, ifns, reorganization, signer } from "./UnclassifiedElements";

export const allElements: SugarElementInfo[] = [
    ...sugarElementsGroups.map(x => x.elements).reduce((x, y) => x.concat(y), []),
    Checkbox,
    content,
    corrnumber,
    cross,
    ifns,
    infoip,
    infoorg,
    item,
    kpp,
    list,
    local,
    name,
    okved,
    period,
    phone,
    reorganization,
    sign,
    signer,
    year,
    force,
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
    Column,
    Row,
];
