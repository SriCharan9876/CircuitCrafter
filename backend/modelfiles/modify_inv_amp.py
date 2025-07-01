def parse_value(val_str):
    """Parses LTspice-style resistor values (e.g., '1k', '470', '10m') into ohms."""
    multipliers = {'': 1, 'k': 1e3, 'm': 1e-3, 'u': 1e-6, 'n': 1e-9}
    for suffix, factor in multipliers.items():
        if val_str.lower().endswith(suffix):
            try:
                return float(val_str[:-len(suffix)]) * factor if suffix else float(val_str)
            except ValueError:
                pass
    raise ValueError(f"Invalid resistor value format: {val_str}")

def format_value(ohms):
    """Formats ohm value back to LTspice-style string (e.g., 1000 -> '1k')"""
    if ohms >= 1000 and ohms % 1000 == 0:
        return f"{int(ohms / 1000)}k"
    elif ohms < 1:
        return f"{ohms:.1e}".replace('e-03', 'm').replace('e-06', 'u').replace('e-09', 'n')
    else:
        return str(int(ohms))

def modify_gain(input_filename, output_filename, target_gain):
    with open(input_filename, 'r') as f:
        lines = f.readlines()

    rin_index = None
    rf_index = None

    for i in range(len(lines)):
        if lines[i].strip() == "SYMATTR InstName Rin":
            if "SYMATTR Value" in lines[i + 1]:
                rin_index = i + 1
        elif lines[i].strip() == "SYMATTR InstName Rf":
            if "SYMATTR Value" in lines[i + 1]:
                rf_index = i + 1

    if rin_index is None or rf_index is None:
        raise ValueError("Could not find Rin or Rf value lines.")

    # Extract numeric Rin value
    rin_val_str = lines[rin_index].split()[2]
    rin_ohms = parse_value(rin_val_str)

    # Compute new Rf
    rf_ohms = abs(target_gain) * rin_ohms
    rf_val_str = format_value(rf_ohms)

    # Modify the line
    lines[rf_index] = f"SYMATTR Value {rf_val_str}\n"

    with open(output_filename, 'w') as f:
        f.writelines(lines)

    print(f"Modified {output_filename}: Rin = {rin_val_str}, New Rf = {rf_val_str} for gain = {target_gain}")

# === USAGE ===
input_file = "inv_amp.asc"
output_file = "inv_amp_modified.asc"
desired_gain = -6  # Change this to your target gain

modify_gain(input_file, output_file, desired_gain)
