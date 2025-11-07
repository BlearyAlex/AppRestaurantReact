import React, { useState } from 'react'
import { CirclePicker } from 'react-color';
import { Input } from './input';

interface ColorPickerProps{
    value: string;
    onChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({value, onChange}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const handleChangeComplete = (color: any) => {
        onChange(color.hex); // Usamos el valor HEX del color
        setIsOpen(false); // Cierra el picker una vez se selecciona el color
      };

      return (
        <div className="relative">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)} // Cambia el valor del input si es necesario
            readOnly
            placeholder="Selecciona un color"
            className="w-24" // Ajusta el tamaño del input
          />
          <div
            className="absolute inset-y-0 right-0 flex items-center pr-2 cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div
              className="w-6 h-6 rounded-full"
              style={{ backgroundColor: value || '#fff' }} // Muestra el color seleccionado
            />
          </div>
    
          {isOpen && (
            <div className="absolute right-0 top-full mt-2 z-10">
              <div className="rounded-md border shadow-lg bg-white dark:bg-neutral-900 p-3">
                <CirclePicker
                  color={value}
                  onChangeComplete={handleChangeComplete}
                />
              </div>
            </div>
          )}
        </div>
      )
}

export default ColorPicker