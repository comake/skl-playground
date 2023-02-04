import { SelectElementEvent } from '../util/Types';

export interface SelectOptionSection {
  label?: string;
  options: SelectOption[],
}

export interface SelectOption {
  value: string | number;
  label: string;
}

export type SelectProps = {
  label?: string;
  value?: string | number;
  disabled?: boolean;
  defaultOptionLabel?: string;
  sections: SelectOptionSection[];
  onChange: (event: SelectElementEvent) => void;
  classes?: string;
}

function Select({ label, value, defaultOptionLabel, sections, disabled, onChange, classes }: SelectProps) {
  const defaultValue = value || (defaultOptionLabel ? '' : sections[0].options[0]?.value ?? '');
  return (
    <div className={classes}>
      { label && <label>{label}</label> }
      <div className='Select-Wrapper'>
        <select 
          onChange={onChange} 
          required 
          value={value || defaultValue}
          disabled={disabled}
        >
          { defaultOptionLabel && <option disabled hidden value={''}>{defaultOptionLabel}</option> }
          { sections.map((section) => {
            if (section.label && section.label.length > 0) {
              return (
                <optgroup label={section.label} key={section.label}>
                  { section.options.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))
                  }
                </optgroup>
              )
            } else {
              return section.options.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))
            }
          })}
        </select>
      </div>
    </div>
  )
}

export default Select;
