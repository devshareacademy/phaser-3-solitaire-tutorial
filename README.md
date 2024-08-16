# Phaser 3 TypeScript - Solitaire

A Phaser 3 implementation of the game <a href="https://bicyclecards.com/how-to-play/solitaire" target="_blank">Solitaire</a>.

## Demo

You can find a playable version of the game here: <a href="https://devshareacademy.github.io/phaser-3-solitaire-tutorial/" target="_blank">Phaser 3 - Solitaire</a>.

![Gameplay](/docs/gameplay.gif?raw=true 'Gameplay')

## Local Development

### Requirements

<a href="https://nodejs.org" target="_blank">Node.js</a> and <a href="https://pnpm.io/" target="_blank">pNPm</a> are required to install dependencies and run scripts via `pnpm`.

<a href="https://vitejs.dev/" target="_blank">Vite</a> is required to bundle and serve the web application. This is included as part of the projects dev dependencies.

### Available Commands

| Command | Description |
|---------|-------------|
| `pnpm install --frozen-lockfile` | Install project dependencies |
| `pnpm start` | Build project and open web server running project |
| `pnpm build` | Builds code bundle for production |
| `pnpm lint` | Uses ESLint to lint code |

### Writing Code

After cloning the repo, run `pnpm install --frozen-lockfile` from your project directory. Then, you can start the local development
server by running `pnpm start`.

After starting the development server with `pnpm start`, you can edit any files in the `src` folder
and parcel will automatically recompile and reload your server (available at `http://localhost:8080`
by default).

### Deploying Code

After you run the `pnpm build` command, your code will be built into a single bundle located at
`dist/*` along with any other assets you project depended.

If you put the contents of the `dist` folder in a publicly-accessible location (say something like `http://myserver.com`),
you should be able to open `http://myserver.com/index.html` and play your game.

### Static Assets

Any static assets like images or audio files should be placed in the `public` folder. It'll then be served at `http://localhost:8080/path-to-file-your-file/file-name.file-type`.

## Credits

This project would have not been possible without the use of some awesome assets created by some amazing artists! This project would not have been possible without the following people/resources:

* <a href="https://the-wild-kin.itch.io/kin-pixel-playing-cards" target="_blank">KIN</a>
