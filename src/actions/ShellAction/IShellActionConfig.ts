export type ShellType = "powershell" | "sh";

export interface IShellActionConfig {
    shell?: ShellType;
    command: string;
    description?: string;
}
