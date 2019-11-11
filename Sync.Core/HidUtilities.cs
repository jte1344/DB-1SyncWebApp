using HidSharp;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Sync.Core
{
    public static class HidUtilities
    {
        private static IEnumerable<HidDevice> _hidDevices;

        static HidUtilities()
        {
            var list = DeviceList.Local;
            list.Changed += List_Changed;
            _hidDevices = DeviceList.Local.GetHidDevices();
        }

        public static byte[] WriteRead(int productId, int vendorId, byte[] data, int reportLength = 0)
        {
            IEnumerable<HidDevice> devices = new List<HidDevice>();

            // get all devices with the correct report length
            try
            {
                devices = _hidDevices
                    .Where(dev => dev.ProductID == productId && dev.VendorID == vendorId && dev.GetMaxInputReportLength() >= reportLength);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }

            foreach (var device in devices)
            {
                try
                {
                    if (device.TryOpen(out var hidStream))
                    {
                        hidStream.ReadTimeout = 300;

                        using (hidStream)
                        {
                            hidStream.Write(data, 0, data.Length);
                            return hidStream.Read();
                        }
                    }

                    // success
                    break;
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex);
                }
            }

            return new byte[0];
        }

        public static void Write(int productId, int vendorId, byte[] data, int reportLength = 0)
        {
            IEnumerable<HidDevice> devices = new List<HidDevice>();

            // get all devices with the correct report length
            try
            {
                devices = _hidDevices
                    .Where(dev => dev.ProductID == productId && dev.VendorID == vendorId && dev.GetMaxInputReportLength() >= reportLength);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }

            foreach(var device in devices)
            {
                try
                {
                    if (device.TryOpen(out var hidStream))
                    {
                        hidStream.ReadTimeout = 300;

                        using (hidStream)
                        {
                            hidStream.Write(data, 0, data.Length);
                        }
                    }

                    // success
                    break;
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex);
                }
            }
        }

        private static void List_Changed(object sender, DeviceListChangedEventArgs e)
        {
            _hidDevices = DeviceList.Local.GetHidDevices();
        }
    }
}
