export type ShellType = "powershell" | "bash";

export interface IShellActionConfig {
    shell?: ShellType;
    command: string;
    description?: string;
}
