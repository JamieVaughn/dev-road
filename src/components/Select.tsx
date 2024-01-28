import { FormControl, InputLabel, MenuItem, Select } from "@suid/material";
import type { SelectChangeEvent } from "@suid/material/Select";
import type { Accessor, Setter } from "solid-js";

export function SelectMenu (props: {level: Accessor<number>, setLevel: Setter<number>}) {

  const handleChange = (event: SelectChangeEvent) => {
    console.log(event.target.value)
    props.setLevel(Number(event.target.value));
  };

  return (
    <FormControl
      variant="standard"
      sx={{
        m: 1,
        marginTop: 0,
        minWidth: 60,
      }}
    >
      <InputLabel id="demo-simple-select-standard-label" hidden>Level</InputLabel>
      <Select
        labelId="demo-simple-select-standard-label"
        id="demo-simple-select-standard"
        value={props.level()}
        onChange={handleChange}
        label="Level"
      >
        <MenuItem value={1} selected>i</MenuItem>
        <MenuItem value={2}>ii</MenuItem>
        <MenuItem value={3}>iii</MenuItem>
      </Select>
    </FormControl>
  );
}