import { getDocumentation } from "@kontur.candy/generator";

import { addRowButton } from "./DefaultSugarElementInfos/TourElements/addRowButton"; //TODO: перенести в engine
import { address } from "./LegacyElements/address";
import { build } from "./LegacyElements/build";
import { corrnumber } from "./LegacyElements/corrnumber";
import { cross } from "./LegacyElements/cross";
import { deyt } from "./LegacyElements/deyt";
import { digest } from "./LegacyElements/digest";
import { document_cretaion_date } from "./LegacyElements/document_cretaion_date";
import { email } from "./LegacyElements/email";
import { e_mail } from "./LegacyElements/e_mail";
import { ferm_vb_j } from "./LegacyElements/ferm_vb_j";
import { ifns } from "./LegacyElements/ifns";
import { infoip } from "./LegacyElements/infoip";
import { infoorg } from "./LegacyElements/infoorg";
import { inv } from "./LegacyElements/inv";
import { kat } from "./LegacyElements/kat";
import { katpos } from "./LegacyElements/katpos";
import { kokpo } from "./LegacyElements/kokpo";
import { kpp } from "./LegacyElements/kpp";
import { leader_fio } from "./LegacyElements/leader_fio";
import { local } from "./LegacyElements/local";
import { mail } from "./LegacyElements/mail";
import { mal_vb_j } from "./LegacyElements/mal_vb_j";
import { mest } from "./LegacyElements/mest";
import { min_okpo1 } from "./LegacyElements/min_okpo1";
import { name } from "./LegacyElements/name";
import { nom } from "./LegacyElements/nom";
import { okato } from "./LegacyElements/okato";
import { okcm } from "./LegacyElements/okcm";
import { okfs } from "./LegacyElements/okfs";
import { okogu } from "./LegacyElements/okogu";
import { okpo } from "./LegacyElements/okpo";
import { okpo1t } from "./LegacyElements/okpo1t";
import { okpo_2 } from "./LegacyElements/okpo_2";
import { oktmo } from "./LegacyElements/oktmo";
import { okved } from "./LegacyElements/okved";
import { okved_out } from "./LegacyElements/okved_out";
import { org_adress } from "./LegacyElements/org_adress";
import { org_type } from "./LegacyElements/org_type";
import { perfedzelpr } from "./LegacyElements/perfedzelpr";
import { period } from "./LegacyElements/period";
import { phone } from "./LegacyElements/phone";
import { pos } from "./LegacyElements/pos";
import { prd } from "./LegacyElements/prd";
import { prsek } from "./LegacyElements/prsek";
import { reorganization } from "./LegacyElements/reorganization";
import { responsible_fio } from "./LegacyElements/responsible_fio";
import { responsible_post } from "./LegacyElements/responsible_post";
import { sd } from "./LegacyElements/sd";
import { sekdel } from "./LegacyElements/sekdel";
import { sektor } from "./LegacyElements/sektor";
import { sign } from "./LegacyElements/sign";
import { signer } from "./LegacyElements/signer";
import { sred } from "./LegacyElements/sred";
import { stroyka } from "./LegacyElements/stroyka";
import { struk } from "./LegacyElements/struk";
import { togs } from "./LegacyElements/togs";
import { typl } from "./LegacyElements/typl";
import { vid } from "./LegacyElements/vid";
import { year } from "./LegacyElements/year";
import { SugarElementInfo } from "./SugarElementInfo";

const elementsFromGenerator: SugarElementInfo[] = getDocumentation();
const legacyElements = [
    build,
    deyt,
    document_cretaion_date,
    email,
    e_mail,
    inv,
    kat,
    katpos,
    kokpo,
    kpp,
    leader_fio,
    local,
    mail,
    mal_vb_j,
    mest,
    min_okpo1,
    name,
    nom,
    okato,
    okcm,
    okfs,
    okogu,
    okpo,
    okpo1t,
    okpo_2,
    oktmo,
    okved,
    okved_out,
    org_adress,
    org_type,
    perfedzelpr,
    period,
    phone,
    pos,
    prd,
    prsek,
    responsible_fio,
    responsible_post,
    sd,
    sekdel,
    sektor,
    sred,
    stroyka,
    struk,
    togs,
    typl,
    vid,
    year,
    sign,
    infoip,
    infoorg,
    ferm_vb_j,
    digest,
    address,
    corrnumber,
    cross,
    ifns,
    reorganization,
    signer,
];

export const allElements: SugarElementInfo[] = [...elementsFromGenerator, ...legacyElements, addRowButton];
