import { Box, FormHelperText, TextField } from "@mui/material";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import type { ReactNode } from "react";

type Props<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label: string;
  type?: string;
  icon?: ReactNode;
  error?: string;
};

export default function FormTextInput<T extends FieldValues>({
  name,
  control,
  label,
  type = "text",
  icon,
}: Props<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Box sx={{ mb: 1 }}>
          <TextField
            {...field}
            fullWidth
            label={label}
            type={type}
            error={!!fieldState.error}
            InputProps={{
              startAdornment: icon,
            }}
            onChange={(e) => {
              field.onChange(e);
            }}
            sx={{
              "& .MuiOutlinedInput-root.Mui-focused": {
                "& fieldset": {
                  borderColor: "secondary.main",
                },
              },
            }}
          />
          <FormHelperText sx={{ minHeight: "1.25em", color: "primary.dark" }}>
            {fieldState.error?.message || " "}
          </FormHelperText>
        </Box>
      )}
    />
  );
}
