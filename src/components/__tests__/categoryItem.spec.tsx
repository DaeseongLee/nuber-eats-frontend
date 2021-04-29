import { render } from "@testing-library/react";
import React from "react";
import { CategoryItem } from "../categoryItem";


describe("<CategoryItem/>", () => {
    it("should render OK with props", () => {
        const { getByText, debug } = render(<CategoryItem name={"testName"} coverImg={"testImg"} />);
        getByText("testName");
    });
})