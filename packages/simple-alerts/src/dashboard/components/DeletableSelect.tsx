import React from "react";
import Select, { Props, components, OptionProps } from "react-select";
interface AlertOption {
  readonly value: string;
  readonly label: string;
  readonly color: string;
  readonly isFixed?: boolean;
  readonly isDisabled?: boolean;
}

export default function DeletableSelect({ ...props }: Props) {
  return <Select {...props} components={{ Option: DeleteableOption }} />;
}

function DeleteableOption(props: OptionProps<AlertOption>) {
  return (
    <>
      <components.Option {...props}>
        <span style={{ color: props.data.color }}>right click to delete</span>
      </components.Option>
    </>
  );
}
