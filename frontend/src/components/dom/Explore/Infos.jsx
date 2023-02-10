import stores from '@/stores';
import { useEffect } from 'react';
import Utils from '../Utils';

const Infos = () => {
  const { hoveredEcho, clickedEcho } = stores.useGraph((state) => ({
    hoveredEcho: state.hoveredEcho,
    clickedEcho: state.clickedEcho,
  }));

  useEffect(() => {
    if (hoveredEcho) {
      document.body.style.cursor = 'pointer';
    } else {
      document.body.style.cursor = 'default';
    }
  }, [hoveredEcho]);

  return (
    <div className='infos'>
      <div
        className={`hovered hint ${
          hoveredEcho || clickedEcho ? '' : 'visible'
        }`}>
        _move your mouse over an echo to display informations
        <br />
        _click to know more
      </div>
      <div className={`hovered ${hoveredEcho ? 'visible' : ''}`}>
        {hoveredEcho && !clickedEcho && <Basics infos={hoveredEcho} />}
      </div>

      <div className={`clicked ${clickedEcho ? 'visible' : ''}`}>
        {clickedEcho && (
          <>
            <Basics infos={clickedEcho} />
            <br />
            <br />
            <Additional infos={clickedEcho} />
          </>
        )}
      </div>
    </div>
  );
};

const Basics = ({ infos }) => {
  return (
    <>
      <span className='caption'>owner_</span>{' '}
      <span className='emphasize'>{infos.owner}</span>
      <br />
      <span className='caption'>signature_</span>{' '}
      <span className='emphasize'>{infos.signature}</span>
      <br />
      <span className='caption'>chain_</span>{' '}
      <span className='emphasize'>{infos.chainName}</span>
      <br />
      <span className='caption'>generated_</span>{' '}
      <span className='emphasize'>
        <Utils.ElapsedTime timestamp={infos.createdAt} />
      </span>
      <br />
      <span className='caption'>expanse_</span>{' '}
      <span className='emphasize'>{infos.particlesCount.toFixed()}</span>
    </>
  );
};

const Additional = ({ infos }) => {
  console.log(infos); // attributes, expandedCount, lastExpandedAt
  return (
    <>
      <span className='caption'>expanded_</span>{' '}
      <span className='emphasize'>
        {infos.expandedCount === '0'
          ? 'not yet'
          : `${infos.expandedCount} times`}
      </span>
      <br />
      <span className='caption'>last expanded_</span>{' '}
      <span className='emphasize'>
        {infos.expandedCount === '0' ? (
          'x'
        ) : (
          <Utils.ElapsedTime timestamp={infos.lastExpandedAt} />
        )}
      </span>
      <br />
      <br />
      <span className='caption'>spectrum_</span>{' '}
      <span className='emphasize'>{infos.attributes.spectrum.name}</span>
      <br />
      <span className='caption'>scenery_</span>{' '}
      <span className='emphasize'>{infos.attributes.scenery.name}</span>
      <br />
      <span className='caption'>trace_</span>{' '}
      <span className='emphasize'>{infos.attributes.trace.name}</span>
      <br />
      <span className='caption'>atmosphere_</span>{' '}
      <span className='emphasize'>{infos.attributes.atmosphere.name}</span>
    </>
  );
};

export default Infos;
