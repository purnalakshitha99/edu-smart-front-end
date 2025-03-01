import React from "react";
import { Radio } from "@material-tailwind/react";

function Test() {
  return (
    <div>
      <div className="flex gap-10">
        <Radio name="type" label="HTML" />
        <Radio name="type" label="React" defaultChecked />
      </div>
    </div>
  );
}

export default Test;
