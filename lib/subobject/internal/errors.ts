const ANSI_WHITE_BG_RED_FG = '\e[31;47m';
const ANSI_COLOUR_RESET = '\e[0m';


export class ParsingError {
  public constructor(
    public readonly position: number,
    public readonly length: number,
    public readonly message: string,
    public readonly pattern: string | null = null
  ) { }

  public toString(ansiHighlight: boolean = false) {
    const prefix = `${ParsingError.name}: ${this.message} (position: ${this.position}, length: ${this.length})`;

    if (this.pattern === null || !ansiHighlight) {
      return prefix;
    }

    return `${prefix}\n${this.highlightError()}`;
  }

  private highlightError(): string {
    if (this.pattern === null) return '';

    return this.pattern.slice(0, this.position) +
      ANSI_WHITE_BG_RED_FG +
      this.pattern.slice(this.position, this.position + this.length) +
      ANSI_COLOUR_RESET +
      this.pattern.slice(this.position + this.length);
  }
}
