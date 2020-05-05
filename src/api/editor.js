const _tools = [
    {
        "name": "bwa_index_0_7_17",
        "label": "BWA INDEX",
        "r": 37,
        "inputs": [
            {
                "sources": [],
                "id": "reference",
                "label": "Reference",
                "x": -37,
                "y": 0,
            }
        ],
        "outputs": [
            {
                "id": "indexed_reference",
                "label": "TARed fasta with its BWA indices",
                "x": 37,
                "y": 0,
            }
        ]
    },
    {
        "name": "bwa_mem_bundle_0_7_17",
        "label": "BWA MEM Bundle",
        "r": 44,
        "inputs": [
            {
              "sources": [],
                "id": "reference_index_tar",
                "label": "Reference Index TAR",
                "x": -40.41164077909583,
                "y": -17.404002112770456,
            },
            {
              "sources": [],
                "id": "input_reads",
                "label": "Input reads",
                "x": -40.41164077909583,
                "y": 17.404002112770456,
            }
        ],
        "outputs": [
            {
                "id": "dups_metrics",
                "label": "Sormadup metrics",
                "x": 40.41164077909583,
                "y": -17.404002112770456,
            },
            {
                "id": "aligned_reads",
                "label": "Aligned SAM/BAM",
                "x": 40.41164077909583,
                "y": 17.404002112770456,
            }
        ]
    }
  ];
  
  export default {
    getTools: (f) => f(_tools)
  }