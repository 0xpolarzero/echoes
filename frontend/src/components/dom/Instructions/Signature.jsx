import { useEffect, useState } from 'react';
import { Select } from 'antd';
import stores from '@/stores';
import config from '@/data';

const { Option } = Select;

const Signature = ({ count }) => {
  const { setTrait } = stores.useTraits();
  const { chainId } = stores.useConfig();
  const { availableSignatures } = stores.useGraph();
  const [selected, setSelected] = useState('');

  useEffect(() => {
    setTrait('signature', selected);
  }, [selected, setTrait]);

  return (
    <div className='section' style={{ top: `${count * 200}%` }}>
      <h1>_signature</h1>
      <div className='informations' style={{ marginBottom: '1rem' }}>
        Choose a unique identifier for your echo from the list.
      </div>
      <div className='name-choice'>
        <Select
          defaultValue={null}
          style={{ minWidth: 300 }}
          onChange={setSelected}>
          {availableSignatures[chainId || config.defaultChainId].map(
            (choice, index) => (
              <Option key={index} value={choice}>
                {choice}
              </Option>
            ),
          )}
        </Select>
      </div>
    </div>
  );
};

export default Signature;
