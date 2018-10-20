import path from "path";

import { SugarElementGroupInfo } from "../../SugarElementGroupInfo";

import { addRowButton } from "./addRowButton";
import { enterEvent } from "./enterEvent";
import { startTour } from "./startTour";
import { totalAmount } from "./totalAmount";
import { tour } from "./tour";

export const tourElementsGroup: SugarElementGroupInfo = {
    name: "TourElements",
    caption: "Стартовый тур",
    descriptionPath: path.join(__dirname, "README.md"),
    elements: [addRowButton, enterEvent, startTour, totalAmount, tour],
};
