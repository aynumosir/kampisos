export namespace Changelog {
	export type Category = "content" | "feature" | "chore";
}

export type Changelog = {
	categories: Changelog.Category[];
	content: string;
	contentAinLatn: string;
	contentAinKana: string;
	publishedAt: string;
};
