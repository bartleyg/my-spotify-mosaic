<script>
  import { onMount } from 'svelte';
  import axios from 'axios';
  import Spinner from './Spinner.svelte';

  let songs = [];
  let loading = true;
  const IMG_MAX_WIDTH = 550;

  $: imgWidth = (window.innerWidth < IMG_MAX_WIDTH) ? window.innerWidth : IMG_MAX_WIDTH;

  onMount(async () => {
    songs = await getMosaic();
    loading = false;
  });

  function getMosaic() {
    return axios.get('/api/mosaic')
      .then(response => {
        if (response.data.error) {
          console.log('ERROR /api/mosaic:', response.data.error);
        } else {
          console.log('mosaic response.data.songs:', response.data.songs)
          return response.data.songs;
        }
      })
      .catch(error => console.log('ERROR /api/mosaic:', error));
  }
</script>

<h1 class="green">Bartley's Spotify <span class="nowrap">🎶 Mosaic 🖼</span></h1>
<h3 class="pink">My recently played song cover art updated automatically.</h3>
<div class="container">
  {#if loading}
    <Spinner/>
  {/if}
  {#if songs.length > 0}
    {#each songs as song, index}
      <a href={song.uri}>
        <img src={song.image} alt={song.name} width={imgWidth} />
      </a>
    {/each}
  {:else if !loading && songs.length === 0}
    <h3>No canvases found ☹️</h3>
  {/if}
</div>
<p class="footer">
  <a href="https://bartleygillan.com" target="_blank" rel="noopener noreferrer">
    Made with&nbsp;
    <span role="img" aria-label="red heart">❤️</span>
    by Bartley Gillan
  </a>
</p>

<style>
  .nowrap {
    white-space: nowrap;
  }
  .green {
    color: #4AFF68;
  }
  .pink {
    color: #FB65B2;
  }
  .container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
  .footer {
    font-size: 12px;
    margin-top: 30px;
  }
</style>
