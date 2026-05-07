import { Button, Dialog, Text } from "@radix-ui/themes";
import { estypes } from "@elastic/elasticsearch";
import { FC, Suspense } from "react";
import { useTranslations } from "next-intl";

import { Filter, FilterRootProps } from "@/components/Filter";
import { EntryAggregate, EntryHit } from "@/models/entry";

export type MobileFilterButtonProps = {
  className?: string;
  defaultValues: FilterRootProps["defaultValues"];
  searchResponsePromise: Promise<
    estypes.SearchResponse<EntryHit, EntryAggregate>
  >;
};

export const MobileFilterButton: FC<MobileFilterButtonProps> = (props) => {
  const { className, defaultValues, searchResponsePromise } = props;

  const t = useTranslations("/app/[locale]/search/MobileFilterButton");

  return (
    <Dialog.Root>
      <Dialog.Trigger className={className}>
        <Button variant="ghost">{t("title")}</Button>
      </Dialog.Trigger>

      <Dialog.Content>
        <Dialog.Title>
          <Text size="4" weight="bold">
            {t("title")}
          </Text>
        </Dialog.Title>

        <Dialog.Description>{t("description")}</Dialog.Description>

        <Suspense fallback={<Filter.Skeleton />}>
          <Filter.Root
            defaultValues={defaultValues}
            searchResponsePromise={searchResponsePromise}
          />
        </Suspense>
      </Dialog.Content>
    </Dialog.Root>
  );
};
