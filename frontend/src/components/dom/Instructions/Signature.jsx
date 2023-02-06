import { useEffect, useState } from 'react';
import { Select } from 'antd';
import config from '@/data';
import stores from '@/stores';

const names = config.names;
const { Option } = Select;

const Signature = ({ count }) => {
  const { setTrait } = stores.useTraits();
  const [choices, setChoices] = useState([]);
  const [selected, setSelected] = useState('');

  const getChoices = async () => {
    // Fetch e.g. Minted event from graph
    // Scrap names from event
    // Filter names from data
    // Set choices

    // Temp
    setChoices(names);
  };

  useEffect(() => {
    setTrait('signature', selected);
  }, [selected, setTrait]);

  useEffect(() => {
    getChoices();
  }, []);

  return (
    <div className='section' style={{ top: `${count * 200}%` }}>
      <h1>_signature</h1>
      <div className='informations' style={{ marginBottom: '1rem' }}>
        Choose a unique identifier for your orb from the list.
      </div>
      <div className='name-choice'>
        <Select
          defaultValue={choices[0]}
          style={{ minWidth: 300 }}
          onChange={setSelected}>
          {choices.map((choice, index) => (
            <Option key={index} value={choice}>
              {choice}
            </Option>
          ))}
        </Select>
      </div>
    </div>
  );
};

export default Signature;
