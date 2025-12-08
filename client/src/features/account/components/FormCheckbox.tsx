import { FormControlLabel, Checkbox } from "@mui/material";
import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";

type Props<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label: string;
};

export default function FormCheckbox<T extends FieldValues>({ name, control, label }: Props<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormControlLabel
          control={
            <Checkbox
              {...field}
              checked={!!field.value}
              color="primary"
            />
          }
          label={label}
          sx={{ mt: 1 }}
        />
      )}
    />
  );
}
