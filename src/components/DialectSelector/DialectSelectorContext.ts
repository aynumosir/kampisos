import { createContext, use } from "react";

export interface DialectSelectorContext {
	ancestorChecked: boolean;
	onChange?: (checked: boolean) => void;
}

const DialectSelectorContext = createContext<DialectSelectorContext>({
	ancestorChecked: false,
});

export const useDialectSelector = (): DialectSelectorContext => {
	return use(DialectSelectorContext);
};

export const DialectSelectorProvider = DialectSelectorContext.Provider;
