import React from 'react';
import cs from '../App.module.css';
import ConstructBase, {BaseProps} from './base';
import {slice, openGroup, openArray, HTTPStore} from 'zarr';
import {ElemArray} from '.';
import Outlet from './outlet';

type Props = BaseProps;

export default function SourceConstruct(props: Props) {
  const {construct, constructDispatch} = props;
  const [zarrUrl, setZarrUrl] = React.useState<string | null>(
    'https://zarr.world/hrrr-analysis-TMPonly-2023-06-chunks360x240x240.zarr'
  );

  // React.useEffect(() => {
  //   constructDispatch({
  //     type: 'set_construct_output',
  //     id: construct.id,
  //     value: data.data,
  //   });
  // }, [construct.id, constructDispatch]);

  const dims = [construct.output?.length];

  return (
    <ConstructBase {...props}>
      <div className={cs.constructType}>SOURCE</div>
      <input
        type="text"
        value={zarrUrl ? zarrUrl : ''}
        onChange={(e) => setZarrUrl(e.target.value)}
      />
      <button disabled={!zarrUrl} onClick={handleLoadClick}>
        Load
      </button>
      <div className={cs.dims}>SHAPE: {JSON.stringify(dims)}</div>
      <Outlet {...props} />
    </ConstructBase>
  );

  async function handleLoadClick() {
    if (!zarrUrl) {
      return;
    }

    const fetchOptions = {redirect: 'follow'};
    const supportedMethods = ['GET', 'HEAD']; // defaults
    const store = new HTTPStore(zarrUrl, {fetchOptions, supportedMethods});

    const z = await openGroup(store, null, 'r');
    console.log(z);
  }
}

// function tryParse(valStr: string): ElemArray {
//   try {
//     return JSON.parse(valStr);
//   } catch (error) {
//     return [];
//   }
// }
