import React from 'react';
import { ServerContext } from '@/state/server';
import SuspendedOverlay from '@/components/server/overview/SuspendedOverlay';

export default () => {
    const status = ServerContext.useStoreState((state) => state.server.data?.status || null);
    const isTransferring = ServerContext.useStoreState((state) => state.server.data?.isTransferring || false);

    if (status === 'installing' || status === 'install_failed' || status === 'reinstall_failed') {
        return <SuspendedOverlay type={'installing'} />;
    }

    if (isTransferring) {
        return <SuspendedOverlay type={'transfer'} />;
    }

    /* Suspended or any conflict state */
    return <SuspendedOverlay type={'suspended'} />;
};
