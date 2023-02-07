import { create } from 'zustand';
import config from '@/data';

export default create((set, get) => ({
  /**
   * @notice Network configuration
   */
  chainId: config.defaultChainId,
  setChainId: (chainId) => set({ chainId }),

  /**
   * @notice Signatures
   */
  filteredAvailableSignatures: [], // always filtered by chain ID
  allAvailableSignatures: [],
  filterAvailableSignatures: (chainId) => {
    // ! Updated when chainId changes
    // Update availableSignatures
  },
  getAllAvailableSignatures: () => {
    // ! Fetched directly on render
    // Get all available signatures from all subgraphs
    // Sort it by chain ID
  },

  /**
   * @notice Subgraphs
   */
  echoes: [],
  getEchoes: () => {
    // Get all echoes from all subgraphs
    // Add their chainId to each echo
    // Sort it by particles count
  },
}));
