import React, { useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/router';
import { Box, Flex, IconButton, useTheme } from '@chakra-ui/react';
import { useUserStore } from '@/store/user';
import dynamic from 'next/dynamic';
import { defaultApp } from '@/constants/model';

import Tabs from '@/components/Tabs';
import SideTabs from '@/components/SideTabs';
import Settings from './components/Settings';
import Avatar from '@/components/Avatar';
import MyIcon from '@/components/Icon';
import PageContainer from '@/components/PageContainer';

const Share = dynamic(() => import('./components/Share'), {
  ssr: false
});
const API = dynamic(() => import('./components/API'), {
  ssr: false
});

enum TabEnum {
  'settings' = 'settings',
  'share' = 'share',
  'API' = 'API'
}

const AppDetail = ({ currentTab }: { currentTab: `${TabEnum}` }) => {
  const router = useRouter();
  const theme = useTheme();
  const { appId } = router.query as { appId: string };
  const { appDetail = defaultApp } = useUserStore();

  const setCurrentTab = useCallback(
    (tab: `${TabEnum}`) => {
      router.replace({
        query: {
          appId,
          currentTab: tab
        }
      });
    },
    [appId, router]
  );

  const tabList = useMemo(
    () => [
      { label: '概览', id: TabEnum.settings, icon: 'overviewLight' },
      { label: '链接分享', id: TabEnum.share, icon: 'shareLight' },
      { label: 'API访问', id: TabEnum.API, icon: 'apiLight' },
      { label: '立即对话', id: 'startChat', icon: 'chatLight' }
    ],
    []
  );

  // useEffect(() => {
  //   window.onbeforeunload = (e) => {
  //     e.preventDefault();
  //     e.returnValue = '内容已修改，确认离开页面吗？';
  //   };

  //   return () => {
  //     window.onbeforeunload = null;
  //   };
  // }, []);

  return (
    <PageContainer>
      <Box display={['block', 'flex']} h={'100%'}>
        {/* pc tab */}
        <Box
          display={['none', 'flex']}
          flexDirection={'column'}
          p={4}
          w={'200px'}
          borderRight={theme.borders.base}
        >
          <Flex mb={4} alignItems={'center'}>
            <Avatar src={appDetail.avatar} w={'34px'} borderRadius={'lg'} />
            <Box ml={2} fontWeight={'bold'}>
              {appDetail.name}
            </Box>
          </Flex>
          <SideTabs
            flex={1}
            mx={'auto'}
            mt={2}
            w={'100%'}
            list={tabList}
            activeId={currentTab}
            onChange={(e: any) => {
              if (e === 'startChat') {
                router.push(`/chat?appId=${appId}`);
              } else {
                setCurrentTab(e);
              }
            }}
          />
          <Flex
            alignItems={'center'}
            cursor={'pointer'}
            py={2}
            px={3}
            borderRadius={'md'}
            _hover={{ bg: 'myGray.100' }}
            onClick={() => router.replace('/app/list')}
          >
            <IconButton
              mr={3}
              icon={<MyIcon name={'backFill'} w={'18px'} color={'myBlue.600'} />}
              bg={'white'}
              boxShadow={'1px 1px 9px rgba(0,0,0,0.15)'}
              h={'28px'}
              size={'sm'}
              borderRadius={'50%'}
              aria-label={''}
            />
            我的应用
          </Flex>
        </Box>
        {/* phone tab */}
        <Box display={['block', 'none']} textAlign={'center'} px={5} py={3}>
          <Box className="textlg" fontSize={'3xl'} fontWeight={'bold'}>
            {appDetail.name}
          </Box>
          <Tabs
            mx={'auto'}
            mt={2}
            w={'300px'}
            list={tabList}
            size={'sm'}
            activeId={currentTab}
            onChange={(e: any) => {
              if (e === 'startChat') {
                router.push(`/chat?appId=${appId}`);
              } else {
                setCurrentTab(e);
              }
            }}
          />
        </Box>
        <Box flex={1} h={'100%'}>
          {currentTab === TabEnum.settings && <Settings appId={appId} />}
          {currentTab === TabEnum.API && <API appId={appId} />}
          {currentTab === TabEnum.share && <Share appId={appId} />}
        </Box>
      </Box>
    </PageContainer>
  );
};

export async function getServerSideProps(context: any) {
  const currentTab = context?.query?.currentTab || TabEnum.settings;

  return {
    props: { currentTab }
  };
}

export default AppDetail;