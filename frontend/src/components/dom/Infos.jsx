import { useEffect } from 'react';
import { Interact } from './Expand';
import Utils from './Utils';
import stores from '@/stores';

const Infos = ({ actions = false }) => {
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
        {actions ? (
          <span className='emphasize'>_click to interact</span>
        ) : (
          '_click to know more'
        )}
      </div>
      <div className={`hovered ${hoveredEcho ? 'visible' : ''}`}>
        {hoveredEcho && !clickedEcho && <Basics infos={hoveredEcho} />}
      </div>

      <div
        className={`clicked ${
          clickedEcho ? (actions ? 'interact visible' : 'visible') : ''
        }`}>
        {clickedEcho && (
          <div>
            <Basics infos={clickedEcho} actions={actions} />
            <br />
            <Additional infos={clickedEcho} />
          </div>
        )}
        {actions && <Interact />}
      </div>
    </div>
  );
};

const Basics = ({ infos, actions }) => {
  return (
    <>
      {!actions && (
        <>
          <span className='caption'>owner_</span>{' '}
          <span className='emphasize'>{infos.owner}</span>
          <br />
        </>
      )}
      <span className='caption'>signature_</span>{' '}
      <span className='emphasize'>{infos.signature}</span>
      <br />
      {!actions && (
        <>
          <span className='caption'>chain_</span>{' '}
          <span className='emphasize'>{infos.chainName}</span>
          <br />
        </>
      )}
      <span className='caption'>generated_</span>{' '}
      <span className='emphasize'>
        <Utils.ElapsedTime timestamp={infos.createdAt} />
      </span>
      <br />
      <br />
      <span className='caption'>expanse_</span>{' '}
      <span className='emphasize'>{infos.particlesCount.toFixed()}</span>
    </>
  );
};

const Additional = ({ infos }) => {
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
          '_'
        ) : (
          <Utils.ElapsedTime timestamp={infos.lastExpandedAt} />
        )}
      </span>
      <br />
      <br />
      <span className='caption min'>spectrum_</span>{' '}
      <span className='emphasize min'>{infos.attributes.spectrum.name}</span>
      <br />
      <span className='caption min'>scenery_</span>{' '}
      <span className='emphasize min'>{infos.attributes.scenery.name}</span>
      <br />
      <span className='caption min'>trace_</span>{' '}
      <span className='emphasize min'>{infos.attributes.trace.name}</span>
      <br />
      <span className='caption min'>atmosphere_</span>{' '}
      <span className='emphasize min'>{infos.attributes.atmosphere.name}</span>
    </>
  );
};

export default Infos;
